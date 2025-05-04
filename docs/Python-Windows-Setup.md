# How to Check Python Installation and Add Python to PATH on Windows

## Check if Python is Installed

1. Open Command Prompt (press `Win + R`, type `cmd`, and press Enter).
2. Type the following command and press Enter:
   ```
   python --version
   ```
3. If Python is installed and added to PATH, you will see the Python version number, e.g.:
   ```
   Python 3.10.4
   ```
4. If you see an error like `'python' is not recognized as an internal or external command`, Python is either not installed or not added to the PATH environment variable.

## Install Python

1. Download the latest Python installer from the official website: https://www.python.org/downloads/windows/
2. Run the installer.
3. **Important:** During installation, make sure to check the box **"Add Python to PATH"** before clicking "Install Now".
4. After installation, open a new Command Prompt and run `python --version` again to verify.

## Add Python to PATH Manually

If Python is installed but not added to PATH, you can add it manually:

1. Find the path to your Python installation directory. It is usually something like:
   ```
   C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\
   ```
2. Open the Start menu, search for **"Environment Variables"**, and select **"Edit the system environment variables"**.
3. In the System Properties window, click the **"Environment Variables..."** button.
4. In the Environment Variables window, under **System variables**, find and select the **Path** variable, then click **Edit...**.
5. Click **New** and add the path to the Python installation directory (e.g., `C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\`).
6. Also add the `Scripts` folder inside the Python directory, e.g.:
   ```
   C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\Scripts\
   ```
7. Click OK on all windows to save changes.
8. Open a new Command Prompt and run `python --version` to verify.

## Running the Server Script

Once Python is installed and added to PATH, you can run the server script by:

- Running the batch file:
  ```
  ai-test-interface\start-server.bat
  ```
- Or running the Python script directly:
  ```
  python ai-test-interface\start-server.py
  ```

This should start the server and open the browser automatically.

---

If you need further assistance, feel free to ask.
