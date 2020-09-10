(function ()
{
    const query = new URLSearchParams(location.search)
    const frame = /** @type {HTMLIFrameElement} */ (document.querySelector("#content"))

    if (!query.has("url"))
    {
        const form = /** @type {HTMLFormElement} */ (document.querySelector("form"))

        form.addEventListener("submit", e =>
        {
            e.preventDefault()
            const inputElem = /** @type {HTMLInputElement} */ (document.querySelector("#inputUrl"))
            const targetUrl = inputElem.value
            query.set("url", targetUrl)
            location = "./?" + query.toString()
        })
        
        return
    }
    else
    {
        document.querySelector("form").remove()
    }

    frame.src = "./" + query.get("url")

    loadanime()

    let firstLoaded = false;

    setFrameSize()

    window.addEventListener("resize", setFrameSize)

    frame.addEventListener("load", function ()
    {
        if (firstLoaded)
        {
            loadanime()
        }
        if (!firstLoaded)
        {
            firstLoaded = true
        }
        frame.contentWindow.document.body.querySelectorAll("*").forEach(x => 
        {
            x.style.backgroundColor = "rgba(255,255,255,0.3)"
        })
        frame.contentWindow.document.body.style.backgroundColor = "rgba(255,255,255,0.5)"
    })

    function setFrameSize()
    {
        frame.width = window.innerWidth
        frame.height = window.innerHeight
    }

    function loadanime()
    {
        jQuery.ajax
            ({
                method: "GET",
                url: "https://yande.re/post.json?limit=1&tags=score:%3E=200+rating:s+order:random",
                dataType: "json",
                success: loadbackgroundsuccess
            });
    }

    function loadbackgroundsuccess(data, status, xhr)
    {
        model = data[0];
        console.log(model);
        jQuery("body").css("background-image", "url('" + "./" + model.sample_url + "')");
        const link = frame.contentWindow.document.createElement("a")
        link.href = "https://yande.re/post/show/" + model.id
        link.innerHTML = "Image source: " + link.href
        link.target = "_blank"
        frame.contentWindow.document.body.appendChild(link)
    }
})()