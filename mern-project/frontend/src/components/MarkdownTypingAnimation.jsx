import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RendererMarkdown = ({ markdown, typingAnimation, typingDelay }) => {
    const [displayedText, setDisplayedText] = useState(markdown);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(!typingAnimation);

    useEffect(() => {
        if (typingAnimation) {
            setDisplayedText('');
            setCurrentIndex(0);
            setIsComplete(false);
        } else {
            setDisplayedText(markdown);
            setIsComplete(true);
        }
    }, [markdown, typingAnimation]);

    useEffect(() => {
        if (typingAnimation && currentIndex < markdown.length) {
            const timer = setTimeout(() => {
                setDisplayedText(markdown.substring(0, currentIndex + 1));
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, typingDelay);

            return () => clearTimeout(timer);
        } else if (typingAnimation) {
            setIsComplete(true);
        }
    }, [markdown, currentIndex, typingDelay, typingAnimation]);

    return (
        <div className="markdown-container">
            <div className="markdown-content">
                <ReactMarkdown
                    components={{
                        code: ({ inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={materialDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        // Add more custom components here if needed
                    }}
                >
                    {displayedText}
                </ReactMarkdown>
            </div>

            {typingAnimation && !isComplete && <span className="cursor">|</span>}

            <style jsx>{`
                .markdown-container {
                    font-family: system-ui, -apple-system, sans-serif;
                    line-height: 1.5;
                    color: white;
                    background-color: black;
                    padding: 20px;
                    border-radius: 4px;
                    width: 100%;
                    max-width: 800px;
                    position: relative;
                }

                .markdown-content h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-top: 0;
                    margin-bottom: 1rem;
                }

                .markdown-content h2 {
                    font-size: 1.75rem;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }

                .markdown-content p {
                    margin-bottom: 1rem;
                }

                .markdown-content strong {
                    font-weight: bold;
                }

                .markdown-content em {
                    font-style: italic;
                }

                .markdown-content ul {
                    list-style-type: disc;
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }

                .markdown-content ol {
                    list-style-type: decimal;
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }

                .markdown-content li {
                    margin-bottom: 0.5rem;
                }

                .markdown-content a {
                    color: #3b82f6;
                    text-decoration: none;
                }

                .markdown-content a:hover {
                    text-decoration: underline;
                }

                .markdown-content pre {
                    background-color: #1e1e1e;
                    border: 1px solid #333;
                    border-radius: 4px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    overflow-x: auto;
                }

                .markdown-content code {
                    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
                    font-size: 0.9rem;
                    color: #50fa7b;
                }

                .markdown-content .inline-code {
                    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
                    background-color: #1e1e1e;
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    font-size: 0.9rem;
                }

                .cursor {
                    display: inline-block;
                    width: 0.5rem;
                    height: 1.2rem;
                    background-color: white;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default RendererMarkdown;