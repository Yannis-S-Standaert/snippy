
responsive-grid
css
name:myName,value:gap,value:xs,value:sm,value:md,value:lg,value:xl
---

.@:name:myName:@ {
    display: grid;
    grid-template-columns: repeat(@:value:xs:@, 1fr);  /* Default column count for the smallest screens */
    grid-gap: @:value:gap:@;
}

/* Extra small devices (portrait phones, 576px and up) */
@media (min-width: 576px) {
    .@:name:myName:@ {
        grid-template-columns: repeat(@:value:xs:@, 1fr); 
    }
}

/* Small devices (landscape phones, 768px and up) */
@media (min-width: 768px) {
    .@:name:myName:@ {
        grid-template-columns: repeat(@:value:sm:@, 1fr);  
    }
}

/* Medium devices (tablets, 992px and up) */
@media (min-width: 992px) {
    .@:name:myName:@ {
        grid-template-columns: repeat(@:value:md:@, 1fr);  
    }
}

/* Large devices (desktops, 1200px and up) */
@media (min-width: 1200px) {
    .@:name:myNam:e@ {
        grid-template-columns: repeat(@:value:lg:@, 1fr);      
    }
}

/* Extra large devices (large desktops, 1400px and up) */
@media (min-width: 1400px) {
    .@:name:myName:@ {
        grid-template-columns: repeat(@:value:xl:@, 1fr);  
    }
}
