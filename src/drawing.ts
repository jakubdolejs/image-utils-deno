import { runTransformCommand } from "./util.ts"
import { OutputFormat, Rectangle, StrokeSpec } from "./types.ts"
import { Colour } from "./colour.ts"

/**
 * Draw a rectangle on image
 * @param input Byte array with an image in JPG or PNG format
 * @param rectangle Rectangle to draw (coordinates in pixels)
 * @param fill Fill colour
 * @param stroke Stroke colour and width
 * @param outputFormat PNG or JPG
 * @returns Promise that resolves to a byte array containing the input image converted to the output format with rectangle drawn on the image
 */
export function drawRectangle(input: Uint8Array, rectangle: Rectangle, fill: Colour, stroke: StrokeSpec, outputFormat: OutputFormat = "png"): Promise<Uint8Array> {
    if (outputFormat.toLowerCase() != "png" && outputFormat.toLowerCase() != "jpg") {
        return Promise.reject(new Error("Invalid output format. Valid formats are png and jpg."));
    }
    const rectSpec = `rectangle ${Math.ceil(rectangle.x)},${Math.ceil(rectangle.y)} ${Math.floor(rectangle.x+rectangle.width)},${Math.floor(rectangle.y+rectangle.height)}`
    return runTransformCommand(input, (inputFileName, outputFileName) => {
        return ["convert", inputFileName, "-stroke", stroke.colour.toString(), "-strokewidth", stroke.width.toString(), "-fill", fill.toString(), "-draw", rectSpec, `${outputFormat}:${outputFileName}`]
    })
}