# ng2-inline-require

Tool for inline styles and templates into components of Angular2 when use Webpack in development.

## Example

./src/app.component.ts
```js
@Component({
  selector: 'app',
  styles: [
    require('./app.component.scss')
  ],
  template: require('./app.component.html')
})
export class App {}
```

./src/app.component.scss
```css
:host() {
  background-color: #eee;
}
```

./src/app.component.html
```html
<div class="app">Wellcome, user</div>
```

## Build component
```sh
  ng2-inline-require -i ./src/app.component.ts -o ./dist/app.component.ts
```

Result file ./dist/app.component.ts
```js
@Component({
  selector: 'app',
  styles: [`
    :host {
      background-color: #eee;
    }
  `],
  template: `<div class="app">Wellcome, user</div>`
})
export class App {}
```

## Install

```sh
  npm i -g ng2-inline-require
```

## Use

```sh
  ng2-inline-require -i ./src/file.ts -o ./dist/file.ts
```

## Options

```sh
  '-i, --in [path]', 'Input path with .ts file'
  '-o, --out [path]', 'Output path for generated .ts file'
```

## Supported files to inline in *.ts component
- HTML
- CSS
- SCSS
- SASS

## License
[MIT license](https://opensource.org/licenses/MIT)
