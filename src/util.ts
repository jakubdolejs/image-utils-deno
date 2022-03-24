import { resolve } from "./deps.ts"

export function getTempDir(): string {
    return Deno.env.get("TMPDIR") || Deno.env.get("TMP") || Deno.env.get("TEMP") || "/tmp"
}

export async function runTransformCommand(input: Uint8Array, createCommand: (inputTempFile: string, outputTempFile: string) => string[]): Promise<Uint8Array> {
    const inputTempFile = await Deno.makeTempFile()
    const outputTempFile = resolve(getTempDir(), crypto.randomUUID())
    try {
        await Deno.writeFile(inputTempFile, input)
        const cmd = createCommand(inputTempFile, outputTempFile)
        const proc = Deno.run({
            "cmd": cmd,
            "stdout": "null",
            "stderr": "piped"
        })
        const [ status, errorOutput ] = await Promise.all([proc.status(), proc.stderrOutput()])
        proc.close()
        if (!status.success) {
            const error = new TextDecoder("utf-8").decode(errorOutput)
            console.error(`Command failed: ${cmd.join(" ")}: ${error}`)
            throw new Error(error)
        }
        const result = await Deno.readFile(outputTempFile)
        return result
    } finally {
        try {
            await Deno.remove(inputTempFile)
        } catch (_e) {}
        try {
            await Deno.remove(outputTempFile)
        } catch (_e) {}
    }
}