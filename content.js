// Listen for double-click events on the page
document.addEventListener('dblclick', function () {
    // Get the selected text
    const selection = window.getSelection().toString().trim();
    if (selection) {
      // Fetch the definition of the selected word
      fetchDefinition(selection);
    }
  });
  
  function fetchDefinition(word) {
    // Replace spaces with '%20' for URL encoding
    const encodedWord = encodeURIComponent(word);
  
    // Use a free dictionary API to get the definition
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodedWord}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data[0].meanings) {
          const definition = data[0].meanings[0].definitions[0].definition;
          showDefinitionPopup(word, definition);
        } else {
          showDefinitionPopup(word, 'Definition not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching definition:', error);
        showDefinitionPopup(word, 'An error occurred while fetching the definition.');
      });
  }
  
  function showDefinitionPopup(word, definition) {
    // Remove any existing popup
    const existingPopup = document.getElementById('word-definition-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
  
    // Create a new popup element
    const popup = document.createElement('div');
    popup.id = 'word-definition-popup';
    popup.innerHTML = `<strong>${word}</strong>: ${definition}`;
    popup.style.position = 'absolute';
    popup.style.backgroundColor = '#fff';
    popup.style.color = '#000';
    popup.style.padding = '10px';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    popup.style.zIndex = 10000;
    popup.style.maxWidth = '300px';
  
    // Position the popup near the cursor
    document.body.appendChild(popup);
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;
  
    // Remove the popup when clicking elsewhere
    document.addEventListener(
      'click',
      function removePopup(event) {
        if (!popup.contains(event.target)) {
          popup.remove();
          document.removeEventListener('click', removePopup);
        }
      },
      { capture: true }
    );
  }
  