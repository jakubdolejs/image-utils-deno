import { assertEquals, assertAlmostEquals, fail, resolve } from "./deps.ts"
import { imageSize, crop, resample, convert, Size, stackVertically, stackHorizontally, drawRectangle, Colour } from "../mod.ts"
import { getTempDir } from "../src/util.ts"

const divineSize: Size = {
    width: 257,
    height: 388
}
const divine = await Deno.readFile("./tests/divine.png")

Deno.test("image size", async (t) => {
    await t.step("gets image size", async () => {
        const size = await imageSize(divine)
        assertEquals(size.width, divineSize.width)
        assertEquals(size.height, divineSize.height)
    })
})
Deno.test("cropping", async (t) => {
    await t.step("crops image to size", async () => {
        const width = 200
        const height = 300
        const cropped = await crop(divine, 10, 10, width, height)
        const size = await imageSize(cropped)
        assertEquals(size.width, width)
        assertEquals(size.height, height)
    })
    await t.step("fails to crop image to invalid bounds", async () => {
        const width = 500
        const height = 600
        try {
            await crop(divine, 1000, 10, width, height)
            fail("X is outside image bounds")
        } catch (error) {
            // All good
        }
    })
    await t.step("crops image and outputs jpg", async () => {
        const width = 200
        const height = 300
        const cropped = await crop(divine, 10, 10, width, height, "jpg")
        const size = await imageSize(cropped)
        assertEquals(size.width, width)
        assertEquals(size.height, height)
    })
})
Deno.test("resampling", async (t) => {
    const scale = 0.5
    const newSize = {
        width: divineSize.width * scale,
        height: divineSize.height * scale
    }
    async function checkSize(image: Uint8Array) {
        const size = await imageSize(image)
        assertAlmostEquals(size.width, newSize.width, 1.0)
        assertAlmostEquals(size.height, newSize.height, 1.0)
    }
    await t.step("resamples image to width and height", async () => {
        const resampled = await resample(divine, newSize.width, newSize.height)
        await checkSize(resampled)
    })
    await t.step("resamples image to width", async () => {
        const resampled = await resample(divine, newSize.width, undefined)
        await checkSize(resampled)
    })
    await t.step("resamples image to height", async () => {
        const resampled = await resample(divine, undefined, newSize.height)
        await checkSize(resampled)
    })
})
Deno.test("conversion", async (t) => {
    await t.step("converts image from png to jpg", async () => {
        const jpg = await convert(divine, "jpg")
        await convert(jpg, "png")
    })
})
Deno.test("stacking", async (t) => {
    await t.step("stacks images vertically", async () => {
        const stacked = await stackVertically([divine, divine])
        const size = await imageSize(stacked)
        assertEquals(divineSize.width, size.width)
        assertEquals(divineSize.height * 2, size.height)
    })
    await t.step("stacks images horizontally", async () => {
        const stacked = await stackHorizontally([divine, divine])
        const size = await imageSize(stacked)
        assertEquals(divineSize.width * 2, size.width)
        assertEquals(divineSize.height, size.height)
    })
})
Deno.test("drawing", async (t) => {
    await t.step("draws a rectangle on image", async () => {
        const imageWithRect = await drawRectangle(divine, {"x": 20, "y": 20, "width": divineSize.width-40, "height": divineSize.height-40}, Colour.TRANSPARENT, {"width": 4, "colour": Colour.RED})
        const tempFile = resolve(getTempDir(), crypto.randomUUID()+".png")
        try {
            await Deno.writeFile(tempFile, imageWithRect)
            // Get the colour of a pixel inside the drawn rectangle's stroke
            const proc = Deno.run({
                "cmd": ["convert", tempFile, "-crop", "1x1+20+20", `rgb:-`],
                "stdout": "piped",
                "stderr": "piped"
            })
            const [ status, pixel, stderr ] = await Promise.all([proc.status(), proc.output(), proc.stderrOutput()])
            proc.close()
            if (!status.success) {
                const error = new TextDecoder("utf-8").decode(stderr)
                throw new Error(error)
            }
            // Verify that the pixel is pure red as specified in the stroke colour
            assertEquals(3, pixel.length)
            assertEquals(0xff, pixel[0])
            assertEquals(0x00, pixel[1])
            assertEquals(0x00, pixel[2])
        } finally {
            try {
                await Deno.remove(tempFile)
            } catch (err) {}
        }
    })
})