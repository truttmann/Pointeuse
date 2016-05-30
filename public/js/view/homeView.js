define(["jquery", "underscore", "backbone", "text!template/home.html"], function($, _, Backbone, home_tpl) {
    var HomeView = Backbone.View.extend({
        
        id: 'home-view',

        template: _.template(home_tpl),
        
        initialize: function(options) {
            this.user = options.user;
            this.listenToOnce(this.user, 'pointage:failure', function() {
                _.delay(this.loadingStop);
                alert('Erreur de sauvegarde, Veuillez vous déconnecter et recommencer');
            });
        },
        
        loadingStart: function(text_show) {
            $.mobile.loading('show', {
                text: text_show,
                textVisible: true,
                theme: 'b',
                html: ""
            });
        },

        loadingStop: function() {
            $.mobile.loading('hide');
        },
        
        onClickFilter: function(e){
            e.preventDefault();
            var el = e.target;
            if($(el).attr("name") == "entree") {
                this.loadingStart("Sauvegarde de votre pointage ...");
                this.user.pointage("entree");
            } else if($(el).attr("name") == "sortie") {
                this.user.pointage("sortie");
            }
        },
        
        onSubmit: function(e, el) {
            e.preventDefault();
            this.loadingStart();
            var data = Backbone.Syphon.serialize(this);
            
            if(data["action"] == "entree") {
                this.loadingStart("Sauvegarde de votre pointage ...");
                this.user.pointage("entree");
            } else if(data["action"] == "sortie") {
                this.user.pointage("sortie");
            }
            //this.getUser(data);
        },
        
        events: {
            "submit": "onSubmit"
        },
        
        render: function(eventName) {
            this.$el.empty();
            this.$el.append(this.template({
                user: this.user.toJSON()
            }));
            this.trigger('render:completed', this);
            this.$el.find('#entree, #sortie').on('click', function(){$('#action').val($(this).attr('id'));});
            return this;
        }
    });
    return HomeView;
});