import { Gravity, OutputFormat } from "./types.ts"
import { resolve } from "./deps.ts"
import { getTempDir } from "./util.ts"
type Direction = "vertical" | "horizontal"
/**
 * Stack images vertically
 * @param images Images to stack
 * @param gravity Gravity
 * @param outputFormat Output format
 * @returns Promise that resolves to a byte array containing the image of the vertically stacked input images in the specified format
 */
export function stackVertically(images: Uint8Array[], gravity: Gravity = "Center", outputFormat: OutputFormat = "png"): Promise<Uint8Array> {
    return runCommand(images, gravity, outputFormat, "vertical")
}
/**
 * Stack images horizontally
 * @param images Images to stack
 * @param gravity Gravity
 * @param outputFormat Output format
 * @returns Promise that resolves to a byte array containing the image of the horizontally stacked input images in the specified format
 */
export function stackHorizontally(images: Uint8Array[], gravity: Gravity = "Center", outputFormat: OutputFormat = "png"): Promise<Uint8Array> {
    return runCommand(images, gravity, outputFormat, "horizontal")
}
function tempFilesFromBuffers(buffers: Uint8Array[]): Promise<string[]> {
    return Promise.all(buffers.map(async buffer => {
        const fileName = resolve(getTempDir(), crypto.randomUUID())
        await Deno.writeFile(fileName, buffer)
        return fileName
    }))
}
async function runCommand(images: Uint8Array[], gravity: Gravity, outputFormat: OutputFormat, direction: Direction): Promise<Uint8Array> {
    const inputFiles = await tempFilesFromBuffers(images)
    const outputTempFile = resolve(getTempDir(), crypto.randomUUID())
    try {
        const cmd: string[] = ["convert"]
        cmd.push(...inputFiles)
        const appendCommand = direction === "vertical" ? "-append" : "+append"
        cmd.push("-gravity", gravity, appendCommand, `${outputFormat}:${outputTempFile}`)
        const proc = Deno.run({
            "cmd": cmd,
            "stdout": "null",
            "stderr": "piped"
        })
        const [ status, errorOutput ] = await Promise.all([proc.status(), proc.stderrOutput()])
        proc.close()
        if (!status.success) {
            const error = new TextDecoder("utf-8").decode(errorOutput)
            throw new Error(error)
        }
        const result = await Deno.readFile(outputTempFile)
        return result
    } finally {
        for (const file of inputFiles) {
            try {
                await Deno.remove(file)
            } catch (_e) {}
        }
        try {
            await Deno.remove(outputTempFile)
        } catch (_e) {}
    }
}