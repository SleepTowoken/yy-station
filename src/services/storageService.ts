import { getSupabaseClient } from '../lib/supabase'
import type { ServiceResult } from '../types/app'

const OUTFIT_BUCKET = 'outfit-images'
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const MAX_SOURCE_SIZE = 20 * 1024 * 1024
const MAX_UPLOAD_SIZE = 4.8 * 1024 * 1024
const COMPRESSION_STEPS = [
  { edge: 1600, quality: 0.82 },
  { edge: 1280, quality: 0.74 },
  { edge: 1024, quality: 0.68 },
]

type UploadResult = ServiceResult & {
  path?: string
}

type PreparedImage = {
  blob: Blob
  contentType: string
  extension: string
}

function createObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image could not be loaded.'))
    image.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error('Image compression failed.'))
      },
      'image/jpeg',
      quality,
    )
  })
}

async function compressImage(file: File): Promise<PreparedImage> {
  const url = createObjectUrl(file)

  try {
    const image = await loadImage(url)
    let lastBlob: Blob | null = null

    for (const step of COMPRESSION_STEPS) {
      const scale = Math.min(1, step.edge / Math.max(image.naturalWidth, image.naturalHeight))
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('当前浏览器暂时处理不了这张图片。')
      }

      canvas.width = width
      canvas.height = height
      context.fillStyle = '#fff'
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)

      const blob = await canvasToBlob(canvas, step.quality)
      lastBlob = blob
      if (blob.size <= MAX_UPLOAD_SIZE) {
        return { blob, contentType: 'image/jpeg', extension: 'jpg' }
      }
    }

    if (lastBlob) {
      return { blob: lastBlob, contentType: 'image/jpeg', extension: 'jpg' }
    }

    throw new Error('图片压缩失败。')
  } finally {
    URL.revokeObjectURL(url)
  }
}

function createStoragePath(extension: string) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `outfits/${id}.${extension}`
}

function toUploadMessage(message: string) {
  if (message.includes('row-level security') || message.includes('policy')) {
    return '图片空间权限还没开通。'
  }

  if (message.includes('mime') || message.includes('type')) {
    return '图片格式暂时不支持。'
  }

  if (message.includes('exceeded') || message.includes('too large') || message.includes('太大')) {
    return '图片压缩后还是太大，换一张小一点的试试。'
  }

  return '图片上传失败。'
}

export async function uploadOutfitImage(file: File): Promise<UploadResult> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: '图片格式暂时不支持，换 jpg、png 或 webp 试试。' }
  }

  if (file.size > MAX_SOURCE_SIZE) {
    return { ok: false, error: '原图太大了，换一张小一点的试试。' }
  }

  try {
    const preparedImage = await compressImage(file)
    if (preparedImage.blob.size > MAX_UPLOAD_SIZE) {
      return { ok: false, error: '图片压缩后还是太大，换一张小一点的试试。' }
    }

    const path = createStoragePath(preparedImage.extension)
    const { error } = await supabase.storage.from(OUTFIT_BUCKET).upload(path, preparedImage.blob, {
      cacheControl: '3600',
      contentType: preparedImage.contentType,
      upsert: false,
    })

    if (error) {
      console.error('Failed to upload outfit image:', error)
      return { ok: false, error: toUploadMessage(error.message) }
    }

    return { ok: true, path }
  } catch (error) {
    console.error('Failed to prepare outfit image:', error)
    return { ok: false, error: error instanceof Error ? error.message : '图片上传失败。' }
  }
}
