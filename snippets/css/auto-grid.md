
auto-grid
css
name:className,value:minWidth,value:gap
---
.@:name:className:@ {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(@:value:minWidth:@, 1fr));
    grid-gap: @:value:gap:@;
}
