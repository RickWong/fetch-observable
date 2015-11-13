import {Observable} from "lib/Observable";

export default function () {
	Observable.of(1, 2, 3).forEach((x) => console.log(x));

	return "hello";
}
