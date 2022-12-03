window.onload = function(){
    // add listener to display real-time suggestions once input length is 4 characters or more
    document.getElementById('search').addEventListener('input', async function(e){
      if(e.target.value.length < 4){
        document.getElementById('suggestions').innerHTML = "";
        return;
      }
      // see file /js/Proxy.js for function reference
      const url = urlViaProxy("https://de.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=8&srsearch=" + e.target.value);
      let result = await performHTTPRequest(url);
      processSuggestions(result);
    });
  }

  // display result from sugggestion-request to screen
  async function processSuggestions(content) {
    let json_obj = JSON.parse(content).response;
    var sugs = document.getElementById('suggestions');
    sugs.innerHTML = "";
    if(json_obj.query == null)
      return;
    for(var i = 0; i < json_obj.query.search.length; i++){
      var t = document.createElement('a');
      t.innerHTML = json_obj.query.search[i].title;
      t.setAttribute('href', "https://de.wikipedia.org/w/index.php?curid=" + json_obj.query.search[i].pageid);
      t.setAttribute('target', "_blank");
      sugs.appendChild(t);
    }
  }

  // action when user clicks on "search" button
  async function searchWiki(){
      document.getElementById('popup-headline').innerHTML = "Ergebnisse für: " + document.getElementById('search').value;
      document.getElementById('popup').style.display = "flex";
      // see file /js/Proxy.js for function reference
      const url = urlViaProxy("https://de.wikipedia.org/w/api.php?action=query&generator=prefixsearch&format=json&gpslimit=4&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&redirects=1&gpssearch=" + document.getElementById('search').value);
      let result = await performHTTPRequest(url);
      loadTable(result);
  }

  // display search results
  async function loadTable(content){
      let json_obj = JSON.parse(content).response;
      var tbody = document.getElementById('tbody');
      if(json_obj.query == null){
        tbody.innerHTML = "<td colspan='3' style='text-align: center'>Keine Ergebnisse</td>"
        return;
      }
      tbody.innerHTML = '<tr><th>Seite</th><th>Auszug</th><th>Link</th></tr>';
      // iteration over keys from stackoverflow.com
      for(var key in json_obj.query.pages){
          var page = json_obj.query.pages[key];
          var t = document.createElement('tr');
          t.innerHTML = "<td>"+ page.title + "</td>"
                      + "<td>"+ page.extract  + "</td>"
                      + "<td><a target='_blank' href='https://de.wikipedia.org/w/index.php?curid=" + page.pageid + "'>Zum Artikel</td>";
          tbody.appendChild(t);
      }
  }
  
  function closePopup(){
      document.getElementById('popup').style.display = 'none';
      document.getElementById('tbody').innerHTML = '<td colspan="3">Loading...</td>';
  }