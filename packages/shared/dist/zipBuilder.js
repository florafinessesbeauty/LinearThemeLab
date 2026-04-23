import JSZip from "jszip";
export async function buildThemeZip(files) {
    const zip = new JSZip();
    for (const file of files) {
        zip.file(file.path, file.contents);
    }
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return content;
}
