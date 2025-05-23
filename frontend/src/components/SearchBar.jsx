// Render <SearchBar /> below your <Login /> component in your layout
import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import "../index.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm]               = useState('');
  const [isSearching, setIsSearching]             = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches]           = useState(0);
  const [noMatches, setNoMatches]                 = useState(false);
  const [showControls, setShowControls]           = useState(false);

  // Focus on Ctrl+F / Cmd+F
  useEffect(() => {
    const handleKeyPress = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Scroll & position arrows
  const scrollToMatch = idx => {
    const marks = document.getElementsByTagName('mark');
    if (!marks.length) return;
    const el = marks[idx];
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    Array.from(marks).forEach(m => m.classList.remove('active-match'));
    el.classList.add('active-match');

    const controls = document.querySelector('.search-controls');
    if (controls) {
      const rect    = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      controls.style.position = 'absolute';
      controls.style.top      = `${scrollY + rect.bottom + 5}px`;
      controls.style.left     = `${scrollX + rect.left}px`;
    }
  };

  const handleNext = () => {
    if (currentMatchIndex < totalMatches - 1) {
      const next = currentMatchIndex + 1;
      setCurrentMatchIndex(next);
      scrollToMatch(next);
    }
  };
  const handlePrev = () => {
    if (currentMatchIndex > 0) {
      const prev = currentMatchIndex - 1;
      setCurrentMatchIndex(prev);
      scrollToMatch(prev);
    }
  };

  // highlight helper
  const highlightText = (text, key) => {
    if (!key) return text;
    const re = new RegExp(`(${key})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  };

  // main search
  const handleSearch = e => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(!!value);
    setCurrentMatchIndex(0);
    setShowControls(false);

    // remove old <mark>
    const oldMarks = document.getElementsByTagName('mark');
    while (oldMarks.length) {
      const parent = oldMarks[0].parentNode;
      parent.replaceChild(
        document.createTextNode(oldMarks[0].textContent),
        oldMarks[0]
      );
      parent.normalize();
    }

    if (!value) {
      setTotalMatches(0);
      setNoMatches(false);
      return;
    }

    const keyword = value.toLowerCase();
    let count = 0;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: node =>
          ['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentNode.nodeName)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT
      }
    );
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode => {
      const txt = textNode.textContent;
      if (txt.toLowerCase().includes(keyword)) {
        const matches = txt.match(new RegExp(keyword, 'gi'));
        if (matches) {
          count += matches.length;
          const span = document.createElement('span');
          span.innerHTML = highlightText(txt, value);
          textNode.parentNode.replaceChild(span, textNode);
        }
      }
    });

    setTotalMatches(count);
    setNoMatches(count === 0);

    if (count > 0) {
      scrollToMatch(0);
      setShowControls(true);
    }
  };

  return (
    <div className="search-container">
      <form autoComplete="off" noValidate style={{ display: 'inline-block' }}>
        <div
          className="search-input-wrapper"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            border: '2px solid #000',
            borderRadius: '4px',
            padding: '0 0.5rem',
            width: '200px',
            height: '32px',
            background: '#fff'
          }}
        >
          <input
            id="global-search-input"
            type="text"
            name="searchField"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={e => {
              if (e.key === 'Enter' && totalMatches) {
                e.preventDefault();
                scrollToMatch(0);
                setShowControls(true);
              }
            }}
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            className="search-input"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              height: '100%',
              fontSize: '1rem'
            }}
          />

          {isSearching && (
            <button
              className="clear-search"
              onClick={() => handleSearch({ target: { value: '' } })}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              ×
            </button>
          )}

          {noMatches && (
            <span
              className="no-matches-inline"
              style={{
                display: 'block',
                color: 'red',
                fontSize: '0.9rem',
                position: 'absolute',
                right: '0.5rem',
                top: '110%'
              }}
            >
              No matches found
            </span>
          )}
        </div>
      </form>

      {totalMatches > 0 && (
        <div className={`search-controls ${showControls ? 'visible' : ''}`}>
          <button className="nav-button" onClick={handlePrev} disabled={currentMatchIndex === 0}>
            <FaChevronUp />
          </button>
          <span className="match-count">
            {currentMatchIndex + 1} of {totalMatches}
          </span>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentMatchIndex === totalMatches - 1}
          >
            <FaChevronDown />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
