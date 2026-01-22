# Ethos Blog CMS

### A Content Management System (CMS) app for managing blog website. Only authors have access to enter the app. Contains WYSIWYG text editor.

<br>

Installation:
```
npm i
npm run dev
```

![main image](https://davidmaksic.vercel.app/assets/ethos-cms-DYmzrfJx.png)

This is the internal application for the Ethos blog, only accessable to the authors of the blog. It's a singe-page application powered by **React**, providing users with fast navigation.

<br />

Authentication, authorization and admin permissions are implemented using **Supabase Auth**. For writing articles, **BlockNote** text editor is used. As for responsive design, desktops and laptops are supported. Application data is stored in **Supabase** database. Deployed on **Vercel**.

<br />
<br />

## Log in screen

First of all, only approved users can log in. Existing authors are the only ones who can create new authors. When new author wants to gain access to the site, they use a password provided by an existing author and, after they verify their e-mail address, they can log in.

<br />

![log in screen](https://davidmaksic.vercel.app/assets/cms-1-D2IGTwo4.png)

<br />
<br />

## Dashboard

Upon logging in, new author will see the dashboard page, which contains all the relevant information and statistics about the blog. Here user can see all the drafted articles that haven't been published yet.

<br />

![dashboard](https://davidmaksic.vercel.app/assets/cms-2-B5KFKNDd.png)

<br />
<br />

## Admin permissions

This project is showcased with a profile which has admin permissions. Image bellow shows restricted navigation sidebar of the usual (non-admin) author. Protected routes cannot be accessed.

<br />

Only an admin can create new author profiles, feature articles, create and edit tags, and manage settings. Admins can also edit and delete any article.

<br />

![admin permissions](https://davidmaksic.vercel.app/assets/admin-permissions-DhjzlD_c.png)

<br />
<br />

## Article creator

Here authors can write their articles. There are a lot of options, such as choosing a title, description, category and image (which can be previewed); language can be set as well, which changes article's font. There is also a side config button on the right, which opens a small menu with theme, fullscreen and scroll options.

<br />

![article creator](https://davidmaksic.vercel.app/assets/cms-3-Cb-pDhZP.png)

<br />
<br />

Fullscreen option temporarily hides sidebar and header, which gives more space for easier writing. As for the article's content, thanks to the WYSIWYG text editor, author has many options for styling the text.

<br />

![article creator 2](https://davidmaksic.vercel.app/assets/cms-4-SMTieGdc.png)

<br />
<br />

## Article management

Arhive is the major part of the app. Here authors can see basic information regarding all the articles; they can search, sort, filter by status, etc.

<br />

![archive](https://davidmaksic.vercel.app/assets/cms-5-DVDg0b3q.png)

<br />
<br />

If they click on article's title, they can see how an article looks. Main image card contains edit and delete options.

<br />

![article page](https://davidmaksic.vercel.app/assets/cms-6-CZNZZK8i.png)

<br />
<br />

While inspecting the article, author can use basic options on the right. For example, table of contents.

<br />

![article page options](https://davidmaksic.vercel.app/assets/cms-7-DGJtZRrP.png)

<br />
<br />

Authors can edit their articles, with the same options as in article creator.

<br />

![article edit page](https://davidmaksic.vercel.app/assets/cms-8-JX3rxQdt.png)

<br />
<br />

When they are done with editing, authors can also change current status of the article.

<br />

![article edit page 2](https://davidmaksic.vercel.app/assets/cms-9-UV_0KLjA.png)

<br />
<br />

## Features

This page has two parts: main and tag features. Here authors can decide which articles will be featured on the landing page of the blog. "Main features" is a slider with one or more articles.

<br />

![main features](https://davidmaksic.vercel.app/assets/cms-10-CybqXPGM.png)

<br />
<br />

"Tag features" is a collection of 3 articles; each tag can have up to 3 featured articles. If there are only 2 featured articles here, they won't be displayed; 3 articles are a minimum.

<br />

![tag features](https://davidmaksic.vercel.app/assets/cms-11-QkaFqpZf.png)

<br />
<br />

When adding articles, this modal will show up. Author can search and choose which article to feature.

<br />

![feature modal](https://davidmaksic.vercel.app/assets/cms-12-CTMPiTec.png)

<br />
<br />

## Tag creator

On this page authors can create new tags (categories). They can choose colors, and see the preview.

<br />

![tag creator](https://davidmaksic.vercel.app/assets/cms-13-CbWgD21s.png)

<br />
<br />

Same options are provided when editing existing tags. When choosing a color, a modal pops up that provides plenty of options.

<br />

![tag edit](https://davidmaksic.vercel.app/assets/cms-14-CZXJEkGz.png)

<br />
<br />

## Author list

All authors are displayed here, with some basic information about them.

<br />

![authors page](https://davidmaksic.vercel.app/assets/cms-15-DntLoSll.png)

<br />
<br />

If the gear icon is clicked, author will be navigated to the profile settings page. Here they can change their full name, description, image or password.

<br />

![profile edit](https://davidmaksic.vercel.app/assets/cms-16-CTCVEbxV.png)

<br />
<br />

When creating a new author, all the standard information is required. In all inputs of the app, validation is implemented; in this case, passwords need to match, and other fields must not be empty.

<br />

![author creator](https://davidmaksic.vercel.app/assets/cms-17-BccPW7SM.png)

<br />
<br />

## Settings

Currently, there is only one setting here: the comment length.

<br />

![settings](https://davidmaksic.vercel.app/assets/cms-18-Wi_kJvrx.png)

<br />

## Credits

Special thanks to **[Jonas Schmedtmann](https://www.udemy.com/user/jonasschmedtmann/)**, thanks to whom I learned everything I know; his work was an inspiration for most of my projects. If you are new at learning web development check him out!
