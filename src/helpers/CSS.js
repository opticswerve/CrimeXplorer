// Adopted stylesheet helpers
//----------------------------

export function adoptCSS(css, id) {

	if (id !== undefined) {
		if (getAdoptedStyleSheet(id) !== undefined) {
			return; // Already adopted
		}
	}

	let sheet = new CSSStyleSheet();

	if (id !== undefined) {
		sheet.id = id;
	}

	sheet.replaceSync(css);

	document.adoptedStyleSheets.push(sheet);
}

export function getAdoptedStyleSheet(id) {
	for (const sheet of document.adoptedStyleSheets) {
		if (sheet.id === id) {
			return sheet;
		}
	}
}

export function deleteAdoptedStyleSheet(id) {
	let sheets = document.adoptedStyleSheets;

	for (let i = 0; i < sheets.length; i++) {
		if (sheets[i].id === id) {
			sheets[i] = sheets[sheets.length - 1];
			sheets.pop();
			return;
		}
	}
}