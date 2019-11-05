module AngularModule.Directives {

    export class WatchUnloaderDirective implements ng.IDirective {

        static $inject = ["RequestQueueService", "$timeout", "$rootScope"];

        constructor(private RequestQueueService, private $timeout, private $rootScope: any) { }

        public restrict = "A";
        public ignore = false;
        public watchersEnabled = true;

        public link = (scope, element, attrs) => {
            let self = this;

            let watchDuringDisable = () => {
                element.$$watchersBackup = element.$$watchersBackup || [];
                element.$$watchers = element.$$watchersBackup;
                let unwatch = element.constructor.prototype.$watch.apply(element);
                element.$$watchers = null;
                return unwatch;
            }

            let toggleWatchers = (scope, enable) => {
                let digest, current, next = scope;
                let pending = self.RequestQueueService.getPendingStatus();

                if (pending) enable = true;

                do {
                    current = next;
                    if (enable) {
                        if (current.hasOwnProperty("$$watchersBackup")) {
                            current.$$watchers = current.$$watchersBackup;
                            delete current.$$watchersBackup;
                            delete current.$watch;
                            if (scope != null) {
                                if (!scope.$root != null) {
                                    digest = !scope.$root.$$phase;
                                }
                            }
                            self.watchersEnabled = true;
                        }
                    } else {
                        if (!current.hasOwnProperty("$$watchersBackup") && !pending) {
                            current.$$watchersBackup = current.$$watchers;
                            current.$$watchers = null;
                            current.$watch = watchDuringDisable;
                            self.watchersEnabled = false;
                        }
                    }

                    next = current.$$childHead;
                    while (!next && current !== scope) {
                        if (current.$$nextSibling) {
                            next = current.$$nextSibling;
                        } else {
                            current = current.$parent;
                        }
                    }
                } while (next);

                if (digest) {
                    scope.$digest();
                }
            }

            let disableDigest = () => {
                toggleWatchers(scope, false);
            }

            let enableDigest = () => {
                toggleWatchers(scope, true);
            }

            scope.$on("toggleWatchers", (event, enable) => {
                toggleWatchers(scope, enable);
            });

            //have $$watchers enabled by default
            if(self.watchersEnabled) toggleWatchers(scope, true);

            //events to toggle $$watchers
            element.on("mouseenter", () => {
                if(!self.watchersEnabled) enableDigest();
            });

            element.on("click", () => {
                if (!self.watchersEnabled) enableDigest();
            });

            element.on("keydown", () => {
                if (!self.watchersEnabled) enableDigest();
            });

            element.on("mouseleave", () => {
                if (!self.ignore)
                    disableDigest();
            });

            element.on("$destroy", () => {
                scope.$destroy();
            });

            //modal-related events
            self.$rootScope.$on("modal.open", () => {
                self.ignore = true;
                enableDigest();
            });

            self.$rootScope.$on("modal.close", () => {
                self.ignore = false;
            });

            self.$rootScope.$on("modal.dismiss", () => {
                self.ignore = false;
            });

        };

        // Directive factory function
        static Create = () => {
            return (RequestQueueService, $timeout, $rootScope) => new WatchUnloaderDirective(RequestQueueService, $timeout, $rootScope);
        };

    }

    angular.module("mymodule").directive("watchUnloader",["RequestQueueService","$timeout", "$rootScope", WatchUnloaderDirective.Create()]);
}
