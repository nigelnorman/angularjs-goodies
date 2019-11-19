module AngularModule.Components {
    export class TriToggleSwitchController {

        public trueVal: any;
        public falseVal: any;
        public nullVal: any;
        public model: any;
        public onToggleChange: (...params: any[]) => any;

        static $inject = ["$scope"];

        private ngModel;

        constructor(private readonly $scope: angular.IScope) {

        }

        public $onInit = () => {
            var ngModelInit = this.$scope.$watch(
                () => this.ngModel.$modelValue,
                () => {
                    if (this.ngModel.$modelValue === undefined ||
                        this.ngModel.$modelValue === null ||
                        this.ngModel.$modelValue === NaN) {
                        this.ngModel.$modelValue = this.nullVal;
                    }
                    this.model = this.ngModel.$modelValue;
                    this.initializeToggle();
                });

        }

        public initializeToggle = () => {

            this.$scope.$watch(() => this.model, () => {
                this.ngModel.$setViewValue(this.model);
                this.ngModel.$setValidity("", true);
            });
        }

        public toggle = async () => {
            await this.updateModel();
        }

        public updateModel = () => {
            if (this.model === this.trueVal) {
                this.model = this.falseVal;
            } else if (this.model === this.falseVal) {
                this.model = this.nullVal;
            } else {
                this.model = this.trueVal;
            }

            this.ngModel.$modelValue = this.model;

        }

    }
    export class TriToggleSwitchComponent {
        static Id = "triToggleSwitch";
        static Options: ng.IComponentOptions = {
            templateUrl: "appjs/_components/tri-toggle-switch/tri-toggle-switch.html",
            controller: TriToggleSwitchController,
            bindings: {
                trueVal: "<",
                falseVal: "<",
                nullVal: "<",
                onToggleChange: "&"
            },
            require: {
                ngModel: "ngModel"
            }
        }
    }

    angular.module("AngularModule")
        .component(TriToggleSwitchComponent.Id, TriToggleSwitchComponent.Options);

}