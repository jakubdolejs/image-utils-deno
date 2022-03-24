import { Size } from "./types.ts"

/**
 * Get image dimensions in pixels
 * @param image Byte array with an image in JPG or PNG format
 * @returns Promise that resolves to the size of the input image
 */
export async function imageSize(image: Uint8Array): Promise<Size> {
    const inputTempFile = await Deno.makeTempFile()
    try {
        await Deno.writeFile(inputTempFile, image)
        const proc = Deno.run({
            "cmd": ["identify", "-ping", "-format", `{"width": %w,"height": %h}`, inputTempFile],
            "stdout": "piped",
            "stderr": "piped"
        })
        const [ status, output, errorOutput ] = await Promise.all([proc.status(), proc.output(), proc.stderrOutput()])
        proc.close()
        const textDecoder = new TextDecoder("utf-8")
        if (!status.success) {
            const error = textDecoder.decode(errorOutput)
            throw new Error(error)
        }
        return JSON.parse(textDecoder.decode(output))
    } finally {
        try {
            await Deno.remove(inputTempFile)
        } catch (_e) {}
    }
}