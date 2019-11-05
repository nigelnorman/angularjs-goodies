// this is meant to be injected into some sort of interceptor in
// the application, such as a loading-bar interceptor: (https://chieffancypants.github.io/angular-loading-bar)
module AngularModule.Services {

    export class RequestQueueService {

        public pendingRequests = true;

        public getPendingStatus = () => {
            let self = this;
            return self.pendingRequests;
        }

        public setPendingStatus = (status: boolean) => {
            let self = this;
            self.pendingRequests = status;
            return self.pendingRequests;
        }

    }

    angular.module("mymodule").service("RequestQueueService", RequestQueueService);
}