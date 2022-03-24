import { OutputFormat } from "./types.ts";
import { runTransformCommand } from "./util.ts"

/**
 * Resample image keeping its aspect ratio
 * @param image Byte array with an image in JPG or PNG format
 * @param width Maximum width of the resampled image in pixels
 * @param height Maximum height of the resampled image in pixels
 * @param outputFormat PNG or JPG (defaults to PNG)
 * @returns Promise that resolves to a byte array containing the resampled image in the specified format
 */
export function resample(image: Uint8Array, width: number|undefined, height: number|undefined, outputFormat: OutputFormat = "png"): Promise<Uint8Array> {
    if (!width && !height) {
        return Promise.reject(new Error("Specify either width or height or both"))
    }
    let geometry: string
    if (width && height) {
        geometry = `${Math.floor(width)}x${Math.floor(height)}`
    } else if (width) {
        geometry = `${Math.floor(width)}`
    } else if (height) {
        geometry = `x${Math.floor(height)}`
    } else {
        throw new Error("Specify either width or height or both")
    }
    return runTransformCommand(image, (inputTempFile, outputTempFile) => ["convert", inputTempFile, "-resize", geometry, `${outputFormat}:${outputTempFile}`])
}