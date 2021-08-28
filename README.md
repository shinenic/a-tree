# Github review enhancer

## :rocket: Quick Features
- Tree view for both Github files and pull requests
- Some handy tools for code review
- Quick search files like VSCode does (*`command + k` or `ctrl + k`*)
- Support SPA for Github Page
- Support private and enterprise repositories

## :computer: Development

### Start project
```shell=
git clone https://github.com/shinenic/github-review-enhancer.git
cd github-review-enhancer
yarn
yarn run dev:watch
```
After the build finished, install the `/build` folder


### Deploy
> TBD

### Build extension
> TBD

### Helper

Quick extension reload for development: [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

## :memo: Appendix

### F&Q

- How to create personal access token
  
  1. Follow this [offcial guide](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
  2. Select `repo` checkbox
     ![](https://i.imgur.com/T1NqD4u.png)
  3. Copy the token into the extension `SETTING`


- Why we need token
  
  1. To access private or enterprise repositories
  2. Github limits requests to 60/hours without `token`


- Why doesn't the extension support dark theme
  
  Yes, the feature is work in process.

- How to trace code in a more efficient way
  
  If you need to trace the code between files, we would recommend that use the **powerful built-in online VS Code in Github** (open via shortcut `.`)

