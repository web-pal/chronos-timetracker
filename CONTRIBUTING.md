# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.


## GitFlow
We use [Vincent Driessen's branching model.](http://nvie.com/posts/a-successful-git-branching-model/)  
Read details here:  
- http://nvie.com/posts/a-successful-git-branching-model/  
- https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow  
- http://danielkummer.github.io/git-flow-cheatsheet/  

Use [git-flow](https://github.com/petervanderdoes/gitflow-avh) package for working with branches.

#### git flow init
Use all init settings as default, except tag prefix, it must be 'v'.


## Commit changes

#### Conventional Commits
We use [conventional commits specification](https://conventionalcommits.org/) for commit messages.

#### Commitizen
To ensure that all commit messages are formatted correctly, we use [Commitizen](http://commitizen.github.io/cz-cli/) in this repository.
It provides interactive interface that creates your commit messages for you.
Running commitizen is as simple as running yarn run commit from the root of the repo.
You can pass all the same flags you would normally use with git commit.

```
  yarn run commit -- -a
```

## Developing
Install dependecies:
```
yarn
```
Run dev process:
```
yarn run dev
```

## Packaging
To package an app for production, please ensure that `MIXPANEL_API_TOKEN` and `SENTRY_API_KEY`
env variables are set.

```
  export MIXPANEL_API_TOKEN=<your_mixpanel_api_token>
  export SENTRY_API_KEY=<your_sentry_api_key>
```

If you don't want to use sentry of mixpanel, you can toggle them with enc variables `DISABLE_MIXPANEL=1` or `DISABLE_SENTRY=1`

```
  export DISABLE_MIXPANEL=1
  export DISABLE_SENTRY=1
```

Then you can package an app with:

#### will include uploading sentry artifacts
```
  yarn package
```

#### will **exclude* uploading sentry artifacts
```
  cross-env UPLOAD_SENTRY=0 yarn package
```


#### will include uploading release to a github
```
  yarn package-release
```


#### will include chrome development tools on production for debugging purposes
```
  yarn package-dev
```

## State architecture
This architecure based on [redux documentation](http://redux.js.org/), so for deeply understanding just read it.

#### To keep clean project's architecture, use these principles:
* [Data normalizing](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) is the most important thing that you have to use.
* [Simple reducer](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html) 
* [Memorized selectors](https://github.com/reactjs/reselect)

## Flow
Don't forget to use a static type checker. Describe the types for all data used.

## Naming convention
Use airbnb naming conventions:  
- https://github.com/airbnb/javascript/tree/master/react#naming  
- https://github.com/airbnb/javascript#naming-conventions
#### Variables
Use declarative style and avoid single letter names.
If you use abbreveature leave comment with deciphering abbreviations.
#### Selectors
All selectors should have a 'get' prefix.
#### Actions
Actions must begin with some verb - set, fetch, fill, add, delete, etc...


## Containers and Components
* [Simple article about it](https://medium.com/@learnreact/container-components-c0e67432e005)
* [Dan Abramov about it](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### Module Structure

This boilerplate uses a [two package.json structure](https://www.electron.build/tutorials/two-package-structure).
This means, you will have two `package.json` files.

1. `./package.json` in the root of your project
1. `./app/package.json` inside `app` folder

### Which `package.json` file to use

**Rule of thumb** is: all modules go into `./package.json` except native modules.
Native modules go into `./app/package.json`.

1. If the module is native to a platform (like system-idle-time) or otherwise should be included
with the published package (i.e. bcrypt, openbci), it should be listed under `dependencies` in `./app/package.json`.
2. If a module is `import`ed by another module, include it in `dependencies` in `./package.json`.
See [this ESLint rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md).
Examples of such modules are `redux-saga`, `redux-form`, and `moment`.
3. Otherwise, modules used for building, testing and debugging should be included in `devDependencies` in `./package.json`.


## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at it@web-pal.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
