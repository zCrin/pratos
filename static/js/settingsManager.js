var idNb = 0;
var Settings = function (obj) {
    this.build(obj)
}
Settings.prototype.build = function (obj) {
    this.construtor = obj;
    idNb++;
    this.id = idNb;
	var classAttr = (this.construtor.classAttr)?this.construtor.classAttr:"";
    this.box = "<div box-id='" + this.id + "' data-ripple='rgba(0,0,0, 0.3)' class='material-shadow-2 material-design-normal-button settings_menu_button  "+classAttr+" '>" + obj.title + "</div>";
}
Settings.prototype.load = function () {

    var that = this;
    $(this.construtor.target).append(this.box)
    if (this.construtor.onLoad) {

        this.construtor.onLoad();
    }

    $("[box-id='" + this.id + "']").click(function () {

        if (that.construtor.onClick) {
            that.construtor.onClick(that.id);
        }
        if (!that.construtor.ask) { // if true, manually call openSetting later
            that.openSetting();
        }

    });
}
Settings.prototype.openSetting = function () {
    var that = this;

    var boxName = (that.construtor.boxName) ? that.construtor.boxName : that.construtor.title;
    $('h2').html(boxName);
    $(that.construtor.target).fadeOut(500); //target correspond to the previous menu you wanna hide when you open the new page

   
    $("<div class='settings_pagebox  settings_menu' id='" + that.id + "_settingsPage'>" + that.construtor.content + "</div>").insertAfter(that.construtor.target)
    setTimeout(function () {
        $("#" + that.id + "_settingsPage").fadeIn(500)
    }, 500);
   $("#" + that.id + "_settingsPage").prepend('<div data-ripple="rgba(0,0,0, 0.3)"  id="settingsButton-step-back" class=" material-shadow-2 material-design-normal-button ' + that.id + '_settingsBack "> <i class="fa fa-chevron-left"></i>  Retour</div>')
    if (that.construtor.onOpened) {
        that.construtor.onOpened(that.id);
    }
	$('.' + that.id + '_settingsBack').show(500).click(function(){
		
		 $("#" + that.id + "_settingsPage").fadeOut(500);
		 
    setTimeout(function () {
       $(that.construtor.target).fadeIn(500)
	    $("#" + that.id + "_settingsPage").remove();
    }, 500);
	});
	
}
