
function fixData(data){
    data = data.replace (/ (< ( [^>]+)>)/gi, "");
    data = data.replace("ä","&auml;").replace("ö","&ouml;").replace("ü","&uml;").replace("Ü", "&Uuml;").replace("Ä","&Auml;").replace("Ö","&Ouml;").replace("ß","&szlig;");
    
    return replace_content(data);
}

function replace_content(content)
{
    var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var element_content=content.replace(exp_match, "<a class='HyperLink' href='$1'>$1</a>");
    var new_exp_match =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var new_content=element_content.replace(new_exp_match, '$1<a target="_blank" href="http://$2">$2</a>');
    return new_content;
}