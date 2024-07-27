// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');


const DEBUG = false;

const SRC_FOLDER = 'src';
const DIST_FOLDER = 'dist';
const ASSETS_FOLDER = 'assets';
const IMG_FOLDER = 'img';
const ICONS_FOLDER = 'icons';
const DATA_FOLDER = './data';
const MATERIALS_FILE = '/materials.json';
const CATEGORIES_FILE = '/categories.json';
const PURCHASES_FILE = '/purchases.json';
const TOOLS_FILE = '/tools.json';
const ORDERS_FILE = '/orders.json';
const PRODUCTS_FILE = '/products.json';
const PRODUCT_VARIANTS_FILE = '/product_variants.json';
const CLIENTS_FILE = '/clients.json';
const SALES_FILE = '/sales.json';
const IMAGES_FOLDER = '/images';


let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		minHeight: 900,
		minWidth: 1200,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		icon: path.join(__dirname, DIST_FOLDER, ASSETS_FOLDER, IMG_FOLDER, ICONS_FOLDER, 'icon.png'),
		frame: false,
		autoHideMenuBar: false,

	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, DIST_FOLDER, 'index.html'));

	// Open the DevTools.
	if (DEBUG) {
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}
}


/**
 * Method to check if file or folder exists on the system
 * @param {string} fileOFolderPath path to check
 * 
 * @returns {boolean} true if exists, false in otherwise
 */
function isExists(fileOFolderPath) {
	return fs.existsSync(fileOFolderPath);
}

/**
 * Method to check if the path is a Directory path (and exists)
 * @param {string} folderPath path to check
 * 
 * @returns {boolean} true if is a directory, false in otherwise
 */
function isDirectory(folderPath) {
	return FileChecker.isExists(folderPath) && fs.statSync(folderPath).isDirectory();
}

/**
 * Method to check if the path is a File path (and exists)
 * @param {string} filePath path to check
 * 
 * @returns {boolean} true if is a file, false in otherwise
 */
function isFile(filePath) {
	return FileChecker.isExists(filePath) && fs.statSync(filePath).isFile();
}

function getFileExtension(file) {
	return path.extname(file);
}

/**
 * Method to read a file synchronously
 * @param {string} filePath file to read
 * 
 * @returns {string} Return the file content
 */
function readFileSync(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

/**
 * Method to read a file asynchronously
 * @param {string} filePath file to read
 * @param {Function} callback callback function to call when read operation finish. Use it to get the file content
 */
function readFile(filePath, callback) {
	fs.readFile(filePath, 'utf8', callback);
}

/**
 * Method to create files asynchronously
 * @param {string} path path to save the file
 * @param {string} content content to write into the file
 * @param {Function} [callback] callback function to handle the end of write
 */
function createFile(path, content, callback) {
	fs.writeFile(path, content, (err) => {
		if (callback) {
			callback.call(this, err);
		}
	});
}

/**
 * Method to create files synchronously
 * @param {string} path path to save the file
 * @param {string} content content to write into the file
 */
function createFileSync(path, content) {
	fs.writeFileSync(path, content);
}

/**
 * Method to create folders synchronously (create the entire folders path if is needed)
 * @param {string} folderPath folder to create
 */
function createFolderSync(folderPath) {
	fs.mkdirSync(folderPath, { recursive: true });
}

/**
 * Method to delete and entire folder (and all subfolders)
 * @param {string} pathToDelete folder to delete
 */
function deleteFs(pathToDelete) {
	if (fs.existsSync(pathToDelete)) {
		if (fs.lstatSync(pathToDelete).isDirectory()) {
			fs.readdirSync(pathToDelete).forEach(function (entry) {
				var entry_path = path.join(pathToDelete, entry);
				if (fs.lstatSync(entry_path).isDirectory()) {
					FileWriter.delete(entry_path);
				} else {
					fs.unlinkSync(entry_path);
				}
			});
			fs.rmdirSync(pathToDelete);
		} else {
			fs.unlinkSync(pathToDelete);
		}
	}
}

function copyFileSync(sourcePath, targetPath) {
	fs.copyFileSync(sourcePath, targetPath);
}

function readDirSync(folderPath, filters) {
	let folderContent = fs.readdirSync(folderPath);
	if (filters) {
		let result = [];
		for (const contentPath of folderContent) {
			let fullPath = folderPath + '/' + contentPath;
			if (filters.onlyFolders && FileChecker.isDirectory(fullPath)) {
				result.push((filters && filters.absolutePath) ? fullPath : contentPath);
			} else if (filters.onlyFiles) {
				if (FileChecker.isFile(fullPath)) {
					if (filters.extensions && filters.extensions.length > 0) {
						if (filters.extensions.includes(path.extname((filters && filters.absolutePath) ? fullPath : contentPath))) {
							result.push((filters && filters.absolutePath) ? fullPath : contentPath);
						}
					} else {
						result.push((filters && filters.absolutePath) ? fullPath : contentPath);
					}
				}
			} else {
				if (filters.extensions && filters.extensions.length > 0) {
					if (filters.extensions.includes(path.extname((filters && filters.absolutePath) ? fullPath : contentPath))) {
						result.push((filters && filters.absolutePath) ? fullPath : contentPath);
					}
				} else {
					result.push((filters && filters.absolutePath) ? fullPath : contentPath);
				}
			}
		}
		return result;
	} else {
		return folderContent;
	}
}

function replace(str, replace, replacement) {
	return str.split(replace).join(replacement);
}

/**
 * Method to get the file name from a path
 * @param {string} filePath path to process
 * @param {string} [extension] file extension to remove
 * 
 * @returns {string} Returns the file name
 */
function getBasename(filePath, extension) {
	return path.basename(filePath, extension);
}

/**
 * Method to get an absolute path from a file or folder path and replace \\ characters with /
 * @param {string} filePath path to process
 * 
 * @returns {string} Returns the absolute file path
 */
function getAbsolutePath(filePath) {
	return replace(path.resolve(filePath), '\\', '/');
}

/**
 * Method to get the directory name from a path
 * @param {string} filePath path to process
 * 
 * @returns {string} Return the folder name
 */
function getDirname(filePath) {
	return replace(path.dirname(filePath), '\\', '/');
}

/**
 * Method to remove a file extension from file path
 * @param {string} file file to process
 * 
 * @returns {string} Returns the path without extension file
 */
function removeFileExtension(file) {
	return file.split('.').slice(0, -1).join('.');
}

/**
 * Method to get the User Home Directory
 */
function getHomeDir() {
	return getAbsolutePath(os.homedir());
}

async function openFileDialog(multiSelect, defaultPath, filters) {
	if (multiSelect) {
		return dialog.showOpenDialog({
			properties: ["openFile", "multiSelections"],
			defaultPath: defaultPath,
			filters: filters
		});
	}
	return dialog.showOpenDialog({
		properties: ["openFile"],
		defaultPath: defaultPath,
		filters: filters
	});
}

async function openFolderDialog(defaultPath) {
	return dialog.showOpenDialog({
		properties: ['openDirectory'],
		defaultPath: defaultPath,
	});
}

async function openSaveFileDialog(defaultPath, filters) {
	return dialog.showSaveDialog({
		defaultPath: defaultPath,
		filters: filters
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();
	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	})
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

ipcMain.handle('minimize', (event, ...args) => {
	console.log('minimize');
	mainWindow.minimize();
});
ipcMain.handle('maximize', (event, ...args) => {
	console.log('maximize');
	mainWindow.maximize();
});
ipcMain.handle('restore', (event, ...args) => {
	console.log('restore');
	mainWindow.unmaximize();
});
ipcMain.handle('close', (event, ...args) => {
	console.log('close');
	mainWindow.close();
});
ipcMain.handle('readFile', (event, ...args) => {
	console.log('readFile');
	return readFileSync(args[0]);
});
ipcMain.handle('writeFile', (event, ...args) => {
	console.log('writeFile');
	return createFileSync(args[0], args[1]);
});
ipcMain.handle('isExists', (event, ...args) => {
	console.log('isExists');
	return isExists(args[0]);
});
ipcMain.handle('watchFile', async (event, ...args) => {
	console.log('watchFile');
	if (args[0]) {
		if (isExists(args[0])) {
			fs.watchFile(args[0], { interval: 1000 }, (currStat, prevStat) => {
				mainWindow.webContents.send(args[1]);
			});
		}
	}
});
ipcMain.handle('watchFolder', async (event, ...args) => {
	console.log('watchFolder');
	if (args[0]) {
		if (isExists(args[0])) {
			fs.watch(args[0], { interval: 1000 }, (eventType, fileName) => {
				mainWindow.webContents.send(args[1]);
			});
		}
	}
});

ipcMain.handle('selectImage', async (event, ...args) => {
	console.log('selectImage');
	const result = await openFileDialog(false, getHomeDir(), [
		{ name: 'Fichero de Imagen', extensions: ['jpg', 'jpeg', 'svg', 'png', 'bmp'] },
	]);
	if (result && !result.canceled && result.filePaths.length > 0) {
		const file = result.filePaths[0];
		const imgFolder = DATA_FOLDER + IMAGES_FOLDER;
		if (!isExists(imgFolder)) {
			createFolderSync(imgFolder);
		}
		const fileName = args[0] + getFileExtension(file);
		copyFileSync(file, imgFolder + '/' + fileName);
		const absPath = getAbsolutePath(imgFolder + '/' + fileName);
		return absPath;
	}
	return undefined;
});
ipcMain.handle('deleteFile', async (event, ...args) => {
	console.log('selectImage');
	const file = args[0];
	if (file && isExists(file)) {
		deleteFs(file);
	}
});



ipcMain.handle('loadMaterials', (event, ...args) => {
	console.log('loadMaterials');
	const file = DATA_FOLDER + MATERIALS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveMaterials', (event, ...args) => {
	console.log('saveMaterials');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + MATERIALS_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadCategories', (event, ...args) => {
	console.log('loadCategories');
	const file = DATA_FOLDER + CATEGORIES_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveCategories', (event, ...args) => {
	console.log('saveCategories');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + CATEGORIES_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadPurchases', (event, ...args) => {
	console.log('loadPurchases');
	const file = DATA_FOLDER + PURCHASES_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('savePurchases', (event, ...args) => {
	console.log('savePurchases');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + PURCHASES_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadTools', (event, ...args) => {
	console.log('loadTools');
	const file = DATA_FOLDER + TOOLS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveTools', (event, ...args) => {
	console.log('saveTools');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + TOOLS_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadOrders', (event, ...args) => {
	console.log('loadOrders');
	const file = DATA_FOLDER + ORDERS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveOrders', (event, ...args) => {
	console.log('saveOrders');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + ORDERS_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadProducts', (event, ...args) => {
	console.log('loadProducts');
	const file = DATA_FOLDER + PRODUCTS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveProducts', (event, ...args) => {
	console.log('saveProducts');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + PRODUCTS_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadClients', (event, ...args) => {
	console.log('loadClients');
	const file = DATA_FOLDER + CLIENTS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveClients', (event, ...args) => {
	console.log('saveClients');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + CLIENTS_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadSales', (event, ...args) => {
	console.log('loadSales');
	const file = DATA_FOLDER + SALES_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveSales', (event, ...args) => {
	console.log('saveSales');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + SALES_FILE, JSON.stringify(args[0], null, 2));
});
ipcMain.handle('loadVariants', (event, ...args) => {
	console.log('loadVariants');
	const file = DATA_FOLDER + PRODUCT_VARIANTS_FILE;
	if (isExists(file)) {
		const materialsData = readFileSync(file);
		return JSON.parse(materialsData);
	}
	return [];
});
ipcMain.handle('saveVariants', (event, ...args) => {
	console.log('saveVariants');
	if (!isExists(DATA_FOLDER)) {
		createFolderSync(DATA_FOLDER);
	}
	createFileSync(DATA_FOLDER + PRODUCT_VARIANTS_FILE, JSON.stringify(args[0], null, 2));
});
