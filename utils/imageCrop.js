
const imageCrop = ({ imageUrl, type }) => {
    if (!imageUrl || !type) {
        throw new Error('imageUrl and type are required');
    }

    const edits = [
        {
            type: "original",
            url: "https://res.cloudinary.com/harsh-090/image/upload/"
        },
        {
            type: "Banner(tall)",
            url: "https://res.cloudinary.com/harsh-090/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/"
        },
        {
            type: "Banner(wide)",
            url: "https://res.cloudinary.com/harsh-090/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative,l_text:montserrat_25_style_light_align_center:Shop%20Now,w_0.5,y_0.18/"
        },
        {
            type: "Circle",
            url: "https://res.cloudinary.com/harsh-090/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/"
        },
        {
            type: "Sharpened",
            url: "https://res.cloudinary.com/harsh-090/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/"
        },
        {
            type: "Square",
            url: "https://res.cloudinary.com/harsh-090/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/"
        },
        {
            type: "Thumbnail",
            url: "https://res.cloudinary.com/harsh-090/image/upload/c_thumb,w_200,g_face/"
        },
    ]

    if (!imageUrl.includes("/image/upload")) {
        throw new Error('Invalid image URL format');
    }

    const extractedString = imageUrl.split("/image/upload")[1];
    
    const requiredString = edits.find((link) => link.type === type);
    

    if (!requiredString) {
        throw new Error(`Invalid type: ${type}`);
    }

    return requiredString.url + extractedString;
}

export { imageCrop }