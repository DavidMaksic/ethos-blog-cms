# Ethos Blog CMS

A Content Management System (CMS) app for managing blog website. Only authors have access to enter the app. Contains WYSIWYG text editor.

Installation:
```
npm i
npm run dev
```

![main image](https://davidmaksic.vercel.app/assets/ethos-cms-DYmzrfJx.png)

This is the internal application for the Ethos blog, only accessable to the authors of the blog. It's a singe-page application powered by **React**, providing users with fast navigation.

Authentication, authorization and admin permissions are implemented using **Supabase Auth**. For writing articles, **BlockNote** text editor is used. As for responsive design, desktops and laptops are supported. Application data is stored in **Supabase** database. Deployed on **Vercel**.


## Log in screen

First of all, only approved users can log in. Existing authors are the only ones who can create new authors. When new author wants to gain access to the site, they use a password provided by an existing author and, after they verify their e-mail address, they can log in.

![log in screen](https://davidmaksic.vercel.app/assets/cms-1-D2IGTwo4.png)

<br />

## Dashboard

Upon logging in, new author will see the dashboard page, which contains all the relevant information and statistics about the blog. Here user can see all the drafted articles that haven't been published yet.

![dashboard](https://davidmaksic.vercel.app/assets/cms-2-B5KFKNDd.png)

<br />

## Admin permissions

This project is showcased with a profile which has admin permissions. Image bellow shows restricted navigation sidebar of the usual (non-admin) author. Protected routes cannot be accessed.

<br />

Only an admin can create new author profiles, feature articles, create and edit tags, and manage settings. Admins can also edit and delete any article.

![admin permissions](https://davidmaksic.vercel.app/assets/admin-permissions-DhjzlD_c.png)

<br />

## Article creator

Here authors can write their articles. There are a lot of options, such as choosing a title, description, category and image (which can be previewed); language can be set as well, which changes article's font. There is also a side config button on the right, which opens a small menu with theme, fullscreen and scroll options.

![article creator](https://davidmaksic.vercel.app/assets/cms-3-Cb-pDhZP.png)

<br />

Fullscreen option temporarily hides sidebar and header, which gives more space for easier writing. As for the article's content, thanks to the WYSIWYG text editor, author has many options for styling the text.

![article creator 2](https://davidmaksic.vercel.app/assets/cms-4-SMTieGdc.png)

<br />

## Article management

Arhive is the major part of the app. Here authors can see basic information regarding all the articles; they can search, sort, filter by status, etc.

![archive](https://davidmaksic.vercel.app/assets/cms-5-DVDg0b3q.png)

<br />

If they click on article's title, they can see how an article looks. Main image card contains edit and delete options.

![article page](https://davidmaksic.vercel.app/assets/cms-6-CZNZZK8i.png)

<br />

While inspecting the article, author can use basic options on the right. For example, table of contents.

![article page options](https://davidmaksic.vercel.app/assets/cms-7-DGJtZRrP.png)

<br />

Authors can edit their articles, with the same options as in article creator.

![article edit page](https://davidmaksic.vercel.app/assets/cms-8-JX3rxQdt.png)

<br />

When they are done with editing, authors can also change current status of the article.

![article edit page 2](https://davidmaksic.vercel.app/assets/cms-9-UV_0KLjA.png)

<br />

## Features

This page has two parts: main and tag features. Here authors can decide which articles will be featured on the landing page of the blog. "Main features" is a slider with one or more articles.

![main features](https://davidmaksic.vercel.app/assets/cms-10-CybqXPGM.png)

<br />

"Tag features" is a collection of 3 articles; each tag can have up to 3 featured articles. If there are only 2 featured articles here, they won't be displayed; 3 articles are a minimum.

![tag features](https://davidmaksic.vercel.app/assets/cms-11-QkaFqpZf.png)

<br />

When adding articles, this modal will show up. Author can search and choose which article to feature.

![feature modal](https://davidmaksic.vercel.app/assets/cms-12-CTMPiTec.png)

<br />

## Tag creator

On this page authors can create new tags (categories). They can choose colors, and see the preview.

![tag creator](https://davidmaksic.vercel.app/assets/cms-13-CbWgD21s.png)

<br />

Same options are provided when editing existing tags. When choosing a color, a modal pops up that provides plenty of options.

![tag edit](https://davidmaksic.vercel.app/assets/cms-14-CZXJEkGz.png)

<br />

## Author list

All authors are displayed here, with some basic information about them.

![authors page](https://davidmaksic.vercel.app/assets/cms-15-DntLoSll.png)

<br />

If the gear icon is clicked, author will be navigated to the profile settings page. Here they can change their full name, description, image or password.

![profile edit](https://davidmaksic.vercel.app/assets/cms-16-CTCVEbxV.png)

<br />

When creating a new author, all the standard information is required. In all inputs of the app, validation is implemented; in this case, passwords need to match, and other fields must not be empty.

![author creator](https://davidmaksic.vercel.app/assets/cms-17-BccPW7SM.png)

<br />

## Settings

Currently, there is only one setting here: the comment length.

![settings](https://davidmaksic.vercel.app/assets/cms-18-Wi_kJvrx.png)

<br />

## Credits

Special thanks to **[Jonas Schmedtmann](https://www.udemy.com/user/jonasschmedtmann/)**, thanks to whom I learned everything I know; his work was an inspiration for most of my projects. If you are new at learning web development check him out!

<br />
