```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User types "Sinbad" and clicks Save

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: Server saves the note to RAM
    server-->>browser: HTTP 302 Redirect to /notes
    deactivate server

    Note over browser: The 302 code forces the browser to reload the page

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JS code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Sinbad", "date": "2026-03-03" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```
