# How to Find Python Installation and Add it to PATH on Windows

## Step 1: Find Python Executable Location

1. Open Command Prompt (press `Win + R`, type `cmd`, and press Enter).
2. Run the following command:
   ```
   where python
   ```
3. This will output the full path(s) to the python.exe executable(s), for example:
   ```
   C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\python.exe
   C:\Windows\py.exe
   ```
4. Note the directory path where python.exe is located (exclude the "python.exe" part), e.g.:
   ```
   C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\
   ```

## Step 2: Add Python Directory to PATH Environment Variable

1. Open the Start menu, search for **"Environment Variables"**, and select **"Edit the system environment variables"**.
2. In the System Properties window, click the **"Environment Variables..."** button.
3. In the Environment Variables window, under **System variables**, find and select the **Path** variable, then click **Edit...**.
4. Click **New** and add the directory path you found in Step 1 (e.g., `C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\`).
5. Also add the `Scripts` folder inside the Python directory, e.g.:
   ```
   C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python310\Scripts\
   ```
6. Click OK on all windows to save changes.
7. Open a new Command Prompt and run:
   ```
   python --version
   ```
   to verify Python is now recognized.

---

After this, you should be able to run your Python scripts and the batch file without the "Python not found" error.

If you need further help, feel free to ask.
