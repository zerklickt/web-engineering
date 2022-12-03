function showFeed(url){
    document.getElementById("popup").style.display = 'flex';
    document.querySelector("body").style.overflow = 'hidden';

    //clear any previous content
    clearContent();
    
    //parser from stackoverflow.com (question #10943544, altered and expanded)
    $.get(url, function (data) {
        window.debugData = data;
        $('#feed-name').html(
            $(data).children("rss").children("channel").children("title").text()
            );
        $('#feed-description').html(
            $(data).children("rss").children("channel").children("description").text()
            );
        $(data).find("item").each(function () {
            var el = $(this);

            let div = document.createElement('div');
            div.classList.add('feed-entry');

            //parse title and description
            let headline = document.createElement('h6');
            headline.innerHTML = el.find("title").text();
            div.appendChild(headline);
            let description = document.createElement('p');
            description.innerHTML = el.find("description").text();
            
            //parse image, if exists
            var media = null;
            $(this).find('content\\:encoded').each(function () {
                var test = new DOMParser().parseFromString($(this).text(), 'text/html').querySelector('img');
                if(test != null){
                    media = test;
                }
            });
            if(media != null){
                var img = document.createElement('img');
                img.setAttribute('src', media.getAttribute('src'));
                div.appendChild(img);
            }
            
            div.appendChild(description);

            //create link to feed-page
            let link = document.createElement('a');
            link.setAttribute('href', el.find("link").text());
            link.setAttribute('target', '_blank');
            link.innerHTML = "weiterlesen...";
            div.appendChild(link);

            document.getElementById('feed-body').appendChild(div);
        });
    });
}

function clearContent(){
    $('#feed-body').html("");
    $('#feed-name').html("Loading...");
    $('#feed-description').html("");
}

function closePopup(){
    $('#popup').css("display", "none");
    document.querySelector("body").style.overflow = 'auto';
}