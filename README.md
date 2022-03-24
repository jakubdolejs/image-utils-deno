# Image utilities for Deno

This library is a collection of image manipulation utilities running inside the [Deno](https://deno.land) runtime. The manipulation is done using [ImageMagick](https://imagemagick.org).

## Requirements

- [Deno](https://deno.land)
- [ImageMagick](https://imagemagick.org)

## API documentation

API documentation is [available]((https://doc.deno.land/https://raw.githubusercontent.com/jakubdolejs/image-utils-deno/main/mod.ts)) on the Deno Doc website.

## Usage

### Get image dimensions

```typescript
import { Size, imageSize } from "./mod.ts"

const file = "myimage.png"
const image: Uint8Array = await Deno.readFile(file)
const size: Size = await imageSize(image)
console.log(`The dimensions of ${file} are ${size.width} x ${size.height} pixels`)
```
### Convert image to a different format*

The following script converts an image called *myimage.png* to a JPG image called *myimage.jpg*

```typescript
import { convert } from "./mod.ts"

const file = "myimage.png"
const image: Uint8Array = await Deno.readFile(file)
const jpeg: Uint8Array = await convert(image, "jpg")
const jpegFile = "myimage.jpg"
await Deno.writeFile(jpegFile, jpeg)
```
*Supported formats are PNG and JPG

### Crop image

The following script crops an image called *myimage.png* to a 200 &times; 300 pixel rectangle that starts 10 pixels from the left edge of the image and 20 pixels from the top of the image. The script then writes the cropped image to a file called *mycroppedimage.png*.

```typescript
import { crop } from "./mod.ts"

const file = "myimage.png"
const image: Uint8Array = await Deno.readFile(file)
const x = 10
const y = 20
const width = 200
const height = 300
const croppedImage: Uint8Array = await crop(image, x, y, width, height)
const croppedImageFile = "mycroppedimage.png"
await Deno.writeFile(croppedImageFile, croppedImage)
```

### Resample image

The following script resamples an image called *myimage.png* to fit into a rectangle that's 200 pixels wide and 300 pixels tall. The script then writes the cropped image to a file called *myresampledimage.png*.

```typescript
import { resample } from "./mod.ts"

const file = "myimage.png"
const image: Uint8Array = await Deno.readFile(file)
const width = 200
const height = 300
const resampledImage: Uint8Array = await resample(image, width, height)
const resampledImageFile = "myresampledimage.png"
await Deno.writeFile(resampledImageFile, resampledImage)
```

### Stack images

The following script stacks the image called *top.png* on top of image called *bottom.png*. If the images are different widths they will be centered. The script writes the resulting image in a file called *myverticalstack.png*.

To stack images horizontally substitute `stackVertically` with `stackHorizontally`.

```typescript
import { stackVertically } from "./mod.ts"

const top = "top.png"
const bottom = "bottom.png"
const stackedImages = "myverticalstack.png"
const [ topImage, bottomImage ] = await Promise.all([Deno.readFile(top), Deno.readFile(bottom)])
const stackedImage = await stackVertically([topImage, bottomImage], "Center", "png")
await Deno.writeFile(stackedImages, stackedImage)
```

### Draw a rectangle on image

The following script draws a rectangle with 4-pixel wide green stroke and semi-transparent fill 10 pixels from each edge of a 640 &times; 480 pixel image called *myimage.png*. The script writes the resulting image in a file called *myimagewithrectangle.png*.

```typescript
import { drawRectangle, Colour } from "./mod.ts"

const file = "myimage.png"
const fileWithRectangle = "myimagewithrectangle.png"
const rectangle = {
    "x": 10,
    "y": 10,
    "width": 620,
    "height": 460
}
const fillColour = Colour.TRANSPARENT
const stroke = {
    "width": 4,
    "colour": Colour.GREEN
}
const image = await Deno.readFile(file)
const imageWithRectangle = await drawRectangle(image, rectangle, fillColour, stroke, "png")
await Deno.writeFile(fileWithRectangle, imageWithRectangle)
```