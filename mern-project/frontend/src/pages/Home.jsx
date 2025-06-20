import { useState, useEffect } from 'react';
import axios from 'axios';
import RendererMarkdown from '../components/MarkdownTypingAnimation';

function Home(){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
        .then(res => setUsers(res.data))
        .catch(err => console.log(err))
    }, []);
    const markdownText = `
# Hello World

This is **bold** and this is *italic*.

- List item 1
- List item 2

\`\`\`python
print("Hello welcome to MD")
\`\`\`

[Link to Google](https://www.google.com)

# Heading 1
## Heading 2
This is **bold** text and this is *italic* text.

Here's some code:
\`\`\`javascript
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

- List item 1
- List item 2
        `;

        const myMarkdown = `

Hey there! Let's whip up a simple Python program. How about one that prints "Hello, world!"? It's a classic for a reason – it's the perfect starting point.
Here's the code:
\`\`\`python
print("Hello, world!")
\`\`\`
That's it! Just one line. The print()
function displays the text within the parentheses. You can run this code in any Python interpreter.
Want something a little more involved? Let's create a program that asks for your name and then greets you personally.
\`\`\`python
name = input("What's your name? ")
print(f"Hello, {name}!")
\`\`\`
This one uses the input()
function to get your name, stores it in the name
variable, and then uses an f-string (the f
before the opening quote) to neatly insert your name into the greeting. Pretty cool, right?
We can even add some fun with regular expressions, although this example is quite straightforward. Let's say we only want to greet people whose names start with a capital letter. We could incorporate a regular expression to validate the input, though it’s overkill for this simple example.
For more complex programs, you’ll use loops, conditional statements (if
, else
), and functions to organize and structure your code effectively. But these two examples give you a great taste of what Python can do! Let me know if you'd like to explore something more advanced!
        
`;

let t = "Who are PLP's successful graduates?";
const getMarkdownResponse = async (t) => {
    const res = await fetch('http://localhost:8000/api/query/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: t })
    });
    const data = await res.json();
    return data.response;
};

const [markdown, setMarkdown] = useState('');

useEffect(() => {
    getMarkdownResponse(t).then(setMarkdown).catch(console.error);
}, []);

return (
    <div>
        <h1>User list</h1>
        <ul>
            {users.map(user => (
                <li key={user._id}>{user.name} - {user.email}</li>
            ))}
        </ul>
        <div>
            <RendererMarkdown markdown={markdown} typingAnimation={true} typingDelay={10} />
        </div>
    </div>
);
}

export default Home;


