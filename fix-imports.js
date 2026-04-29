import fs from 'fs';
import path from 'path';

const dir = 'packages/renderers/lit/src';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    content = content.replace(/from "\.\/(Point|Line|Circle|Polygon|Triangle|Geometry|Driver|RenderDriver|Converters|Angle|version)\.ts"/g, 'from "@village/geometry"');
    fs.writeFileSync(path.join(dir, file), content);
});
