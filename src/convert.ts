import { OutputFormat } from "./types.ts"
import { runTransformCommand } from "./util.ts"

/**
 * Convert image to another format
 * @param input Byte array with an image in JPG or PNG format
 * @param outputFormat PNG or JPG
 * @returns Promise that resolves to a byte array containing the input converted to the output format
 */
export function convert(input: Uint8Array, outputFormat: OutputFormat): Promise<Uint8Array> {
    return runTransformCommand(input, (inputFile, outputFile) => ["convert", inputFile, `${outputFormat}:${outputFile}`])
}