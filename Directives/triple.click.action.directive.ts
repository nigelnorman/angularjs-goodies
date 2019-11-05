module AngularModule.Directives {
    export class TripleClickActionDirective implements ng.IDirective {
        static Id = "tripleClickAction";

        static $inject = ["$parse"];

        constructor(private $parse: ng.IParseService) { }

        public restrict = "A";
        public scope = false;
        public element: ng.IAugmentedJQuery;

        public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            this.element = element;

            this.element.on("click", (evt: any) => {
                if (evt.originalEvent.detail === 3) {
                    this.$parse(attrs[TripleClickActionDirective.Id])(scope);
                }
            });
        }

        public static Create = () => {
            return ($parse) => new TripleClickActionDirective($parse);
        }

    }

    angular.module("mymodule").directive(TripleClickActionDirective.Id, ["$parse", TripleClickActionDirective.Create()]);

}
