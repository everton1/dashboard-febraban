///<reference path="./_references.d.ts"/>


module gogeo {

    export var settings;

    export class Configuration {
        static get serverRootUrl() {
            return <string> settings["server.url"];
        }

        static makeUrl(path: string) {
            var serverUrl: string = Configuration.serverRootUrl;

            if (serverUrl && !serverUrl.endsWith("/"))
                serverUrl = "/";

            return serverUrl + (path.startsWith("/") ? path.substring(1) : path);
        }

        static getTotalTweetsUrl(): string {
            return "http://api.gogeo.io:5454/total";
        }
    }

    var mod = angular.module("gogeo", ["ngRoute", "angularytics", "linkify", "ngGeolocation"])
        .config([
            "$routeProvider",
            "AngularyticsProvider",
            ($routeProvider: ng.route.IRouteProvider, angularyticsProvider: angularytics.AngularyticsProvider) => {
                $routeProvider
                    .when("/welcome", {
                        controller: "WelcomeController",
                        controllerAs: "welcome",
                        templateUrl: "welcome/page.html"
                    })
                    .when("/dashboard", {
                        controller: "DashboardController",
                        controllerAs: "dashboard",
                        templateUrl: "dashboard/page.html"
                    })
                    .otherwise({
                        redirectTo: "/welcome"
                    });
                if (window.location.hostname.match("gogeo.io")) {
                    angularyticsProvider.setEventHandlers(["Google"]);
                } else {
                    angularyticsProvider.setEventHandlers(["Console"]);
                }
            }
        ]).run(
            function(Angularytics) {
                Angularytics.init();
            }
        );

    export interface INamed {
        $named: string;
    }

    export interface INamedType extends Function, INamed {

    }

    export function registerController<T extends INamedType>(controllerType: T) {
        console.debug("registrando controlador: ", controllerType.$named);
        mod.controller(controllerType.$named, <Function> controllerType);
    }

    export function registerService<T extends INamedType>(serviceType: T) {
        console.debug("registrando serviço: ", serviceType.$named);
        mod.service(serviceType.$named, serviceType);
    }

    export function registerDirective(directiveName: string, config: any) {
        console.debug("registrando diretiva: ", directiveName);
        mod.directive(directiveName, config);
    }

    export function registerFilter(filterName: string, filter: (any) => string) {
        console.debug("registrando filtro: ", filterName);
        mod.filter(filterName, () => filter);
    }

}