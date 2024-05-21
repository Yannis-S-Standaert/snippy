
multiline-ellipsis
css
name:className,value:numberOfLines
---
.@:name:className:@ {
    display: -webkit-box;
    -webkit-box-orient: vertical; 
    -webkit-line-clamp: @:value:numberOfLines:@;    
    overflow: hidden;
}
