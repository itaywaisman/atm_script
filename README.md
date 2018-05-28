# atm_script
A simple script to simplify the development in ATM course .
This will execute `as11` for each file change, and execute `sim11` for succesfull assembly.

## Requirements
1. Nodejs is required, version 8.0.0 and higher.
2. You should add both **as11** and **sim11** to your PATH,
or add both executables to the script's folder.

## How to use

Run the following command: `node run.js [filename]`

Where `[filename]` is the .s11 file to watch and assemble.


## Options
1. **Running the simulator in the terminal** - Execute the script with: `node run.js` **-w** `[filename]`

