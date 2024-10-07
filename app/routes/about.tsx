/* Jason's NOTE: The line below is not just a comment, it is a directive that says "supress all TypeScript warnings for this file", so you won't see warnings for things you cannot fix. I'll handle the TypeScript part for now, and there is no special TypeScript code in this file yet because it hasn't been necessary. Files with more advanced logic often require some special TypeScript code to avoid warnings, and depending on what you write some warnings might be triggered, so we'll just silence that noise for now. */
// @ts-nocheck

/* Jason's NOTE: This import makes my custom logger utility available to use in this file. The `from '@funhouse-atelier/logger'` means it is imported from an NPM package I made, published, and then installed in ChefFree. */
import logger from '@funhouse-atelier/logger'
/* Jason's NOTE: My custom main container React component. The `from '~/components/containers'` part means it is exported from the `@/app/components/containers.tsx` file, so you can look in there to see what it actually is.  */
import { MainContainer } from '~/components/containers'
/* Jason's NOTE: My custom React components for responsive headings, links, and other text; exported from the `@/app/components/typography.tsx` file. */
import {
  Heading,
  Text,
  TextExternalLink,
  TextLink,
} from '~/components/typography'

/* Jason's NOTE: The `logger` that was imported is a constructor function. To use it, you call it and as the single argument you may pass it an object containing the options for the `log` object it creates. These options are not required, and if you don't use them there are default settings that will be used instead. However, the way I designed it was to take advantage of setting the options. Then the return value of the `logger` constructor function is assigned to the `log` variable. It is an object with methods you call whenever you would like to `console.log()` something. Here's what the option settings mean:

name: This will be included in any console messages you make in this file, and I set it to the project file path for this file so that it is obvious what file generated the message.

level: This is the *suppression* level of the logger. It ranges from 0-5, where 0 means "allow all messages" and 5 means "silence all messages". I like to use 2 to start. That means some of the log messages will always be sent, critical ones like error, warning, and information, but there are some that are only sent when I drop the suppression level, like debug and stack trace messages, because they are useful when you are having problems but when everything is working fine you might just want to turn them off without deleting them from the code. Turning them on or off is as simple as changing the level setting here from 2 to 0 or back to 2. That's the beauty of how this thing works, in addition to the console messages having timestamps, colorized text, and it is smart about how to show variable values, even things like arrays, objects, or functions. */
const log = logger({ name: '@/app/routes/about.tsx', level: 2 })

/* Jason's NOTE: These are test examples to show what you can do with the `log` methods. They will run every time this file is loaded, so whenever the About page is visited in this case. Check your console to see the output. */
log.error('test error message') // use level 5 suppression to silence this
log.warn('test warning message') // ... level 4+ ...
log.info('test information message') // ... level 3+ ...
log.debug('test debugging message') // ... level 2+ ...
log.trace('test stack trace message') // ... level 1+ ...

/* Jason's NOTE: So what the heck is this? It's an example of how you can make your own component in this file. A component is a custom, re-usable HTML element, and it can contain other HTML elements or components, but there must be just one element to contain them all, and the name must start with a capital letter to distinguish it from regular HTML elements when it is used. In this case it is simply an anonymous function `() =>` that returns what looks like HTML. It uses `className` instead of `class` to include the styling class(es) because it's actually JavaScript code and in JS `class` is a reserved keyword, so you can only use it when defining a JS class, not like the `class` attribute in pure HTML. What the `border-zinc-800` class does is calls upon Tailwind to make the border color of this `<hr>` element dark gray, because by default horizonal rules have a light gray color that does not show up well on ChefFree's yellow background. So keep that in mind, if you ever want to use `<hr>` elements as dividers and you want to change their color you actually have to change their *border* color, not the usual `color` in CSS, which is for text. */
const Divider = () => <hr className="border-zinc-800" />

/* Jason's NOTE: This is the real purpose of this file, to export (as the default, so the name doesn't matter outside of this file, it can be whatever you want here) a function. Why a function, when what it does is show a page? Because that page can be dynamic in any way. In the case of an About page, the content is usually static, but with React you always have the option to just make it dynamic without having to re-write a lot of the code for the page.

This function runs any time the About page is *rendered*. That always happens the first time you load the page, and it can happen again and again if anything on the page changes due to new information or conditions. One example is that the page could display something totally different if it detects that you lost your internet connection, then automatically restore the normal view when you have internet access again. It can also change dynamically based on whatever information is in the database. Every time something about the page display is different this function runs again, and what it returns is the updated view of the page.

That is the power of React, versus static rendering of pages that happens only when you first load the page, and then you have to manually manipulate the DOM yourself to cause changes. React handles all that DOM manipulation for you! */
export default function AboutRoute() {
  /* Jason's NOTE: Here is where you can write some JS logic to figure out how to render the page each time there are changes. You might need to do some of your own calculations, not just rely on the function inputs/arguments. We'll get into this later. */

  /* Jason's NOTE: This function, like the component example above, ultimately returns something that looks a lot like HTML, and you can write mostly plain HTML in there, but in fact it is JS that is convertible to HTML, called "extended JavaScript", or JSX for short. It means you can do a lot more with it than you can with plain HTML or plain JS. It's like a fusion of the two.
  
  Just like the component example above, it must have only one top-level element, so two `<div>`s, side-by-side, would not be valid. For a page like this I wrap everything in the `<MainContainer>` component, so that must also be a single HTML element. Also note that the usual syntax here is to put all of the JSX on separate lines than the `return` keyword, but that means it must be wrapped in parantheses, because without them the JS compiler would not connect the JSX, it would just interpret what you wrote as `return;`, so the function would always return `undefined` and not really render a page.*/
  return (
    /* Jason's NOTE: This wraps the entire page (except for the header navbar, because that's on every page, so it's in the global layout) in a `<main>` element that has a maximum width, a little padding to avoid any text butting up against the edge of the viewport (ugly), and centers the content horizontally with auto margins on the left and right. That's best seen by viewing the About page and resizing your viewport.
    
    It also applies a responsive, baseline font size. On mobile size viewports that's 16px, at 640-1023px wide it's 18px font size, but at 1024px wide or more it's 20px. That's the standard resizing ratio for what you see on every page of ChefFree, basically a 8:9:10 shift as you resize the viewport. This is useful because it avoids having to scale everything manually and it allows for use of `em` measurement in CSS, which is relative to the font size of the container, so you can not only make things like height and width a factor of the baseline font size, to scale up/down nicely, you can do it for things like rounded corners (a.k.a., `border-radius`) so larger views have a little more rounding, and that looks natural as you scale up/down.
    
    It was a very simple piece of code to write, and useful every time I make a new page. DO NOT REMOVE THIS. Do whatever you want inside of it, but removing it is totally out of bounds for you at this time. */
    <MainContainer>
      {/* Jason's NOTE: The main heading of the page, using my custom `<Heading>` component. It's implicitly an `<h1>` because I didn't specify. It includes t-shirt-sizing the text, based on the tag used. */}
      <Heading className="text-center">About ChefFree</Heading>
      {/* Jason's NOTE: A sub-heading. Here I specify that it's an `<h2>` element, and that gives it next-smaller t-shirt size than an `<h1>`. */}
      <Heading Tag="h2">Introduction</Heading>
      {/* Jason's NOTE: Responsive-sized text in a `<p>` element. I didn't specify size, so it defaults to the same as the main container, but I could change the sizing here with something like `size="lg"` or another t-shirt size. */}
      <Text Tag="p">
        ChefFree is a project by Funhouse Atelier to build a free web app where
        users can store and share recipes. That's "free" as in free of charge,
        and also as in freedom of information.
      </Text>
      {/* Jason's NOTE: Please do not remove the intent of this part, but you may redesign it. I always want the About page to encourage people to reach out to me at my Funhouse Atelier email address. While I usually want to use my `<TextLink>` component for links, this one is special because it links to sending an email, not to another page on the web. Note how that's done, with the `href="mailto:funhouse_atelier@protonmail.com"` part. */}
      <Text Tag="p">
        If you have any feedback or questions about the app, please contact us
        at{' '}
        <TextExternalLink href="mailto:funhouse_atelier@protonmail.com">
          funhouse_atelier@protonmail.com
        </TextExternalLink>
      </Text>
      {/* Jason's NOTE: Here's that custom divider component I created above. So easy to use. Don't need to type the whole thing out, just use the name I chose for it. And below, many examples of how `<Heading>` and `<Typography>` look (don't forget to resize your viewport to really see the effects). When writing an About page these will clearly be important to understand and make life easier, maybe avoid you needing to use CSS at all. */}
      <Divider />
      Typography examples below
      <Divider />
      <Heading>Heading 1</Heading>
      <Heading Tag="h2">Heading 2</Heading>
      <Heading Tag="h3">Heading 3</Heading>
      <Heading Tag="h4">Heading 4</Heading>
      <Heading Tag="h5">Heading 5</Heading>
      <Heading Tag="h6">Heading 6</Heading>
      <Divider />
      <Text
        Tag="p"
        size="xs"
      >
        XS size paragraph text
      </Text>
      <Text
        Tag="p"
        size="sm"
      >
        SM size paragraph text
      </Text>
      <Text
        Tag="p"
        size="md"
      >
        MD size paragraph text
      </Text>
      <Text
        Tag="p"
        size="lg"
      >
        LG size paragraph text
      </Text>
      <Text
        Tag="p"
        size="xl"
      >
        XL size paragraph text
      </Text>
      <Text
        Tag="p"
        size="2xl"
      >
        XXL size paragraph text
      </Text>
      <Text
        Tag="p"
        size="3xl"
      >
        XXXL size paragraph text
      </Text>
      <Divider />
      <TextLink
        to="/about"
        className="block"
      >
        link to (this) About page
      </TextLink>
      <TextLink
        to="/"
        size="lg"
        className="block"
      >
        link to home page
      </TextLink>
      <Divider />
      {/* Jason's NOTE: Yes, a primary rule of web dev is EXPECT ANYTHING. Anything could happen. A person could write a recipe description that is just a stream of capital W's, so then what? Better make sure your main container has a way to handle it or it will make the page super wide and force people to scroll RIGHT to see everything. Not a great UX, so my main container will actually line-break a word if it overflows. */}
      Container overflow test:
      WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    </MainContainer>
  )
}
