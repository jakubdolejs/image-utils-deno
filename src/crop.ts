import { OutputFormat } from "./types.ts"
import { runTransformCommand } from "./util.ts"

/**
 * Crop image
 * @param input Byte array with an image in JPG or PNG format
 * @param x Number of pixels to crop from the left edge of the image
 * @param y Number of pixels to crop from the top edge of the image
 * @param width Width of the cropped image in pixels
 * @param height Height of the cropped image in pixels
 * @param outputFormat PNG or JPG (defaults to PNG)
 * @returns Promise that resolves to a byte array containing the cropped image in the specified format
 */
export function crop(input: Uint8Array, x: number, y: number, width: number, height: number, outputFormat: OutputFormat = "png"): Promise<Uint8Array> {
    return runTransformCommand(input, (inputTempFile, outputTempFile) => ["convert", inputTempFile, "-crop", `${Math.floor(width)}x${Math.floor(height)}+${Math.ceil(x)}+${Math.ceil(y)}`, `${outputFormat}:${outputTempFile}`])
}