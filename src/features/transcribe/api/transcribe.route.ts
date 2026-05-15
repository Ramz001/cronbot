import { experimental_transcribe as transcribe } from 'ai'
import { mapError } from '@shared/api/map-error'
import { NextRequest, NextResponse } from 'next/server'

export const transcribeAudio = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const audioBuffer = await audioFile.arrayBuffer()

    const result = await transcribe({
      model: 'openai/whisper-1',
      audio: new Uint8Array(audioBuffer),
    })

    return NextResponse.json({ success: true, text: result.text })
  } catch (error) {
    const { error: mappedError, status } = mapError(error)
    console.error('[Transcription Error]:', error)

    return NextResponse.json({ success: false, error: mappedError }, { status })
  }
}
