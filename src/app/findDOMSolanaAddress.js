import isSolanaAddress from "./checkSolanaAddress.js";

const findSolanaAddresses = () => {
    const processTweets = () => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        
        tweets.forEach(tweet => {
            const tweetContent = tweet.querySelector('div[data-testid="tweetText"]');
            
            if (tweetContent) {
                const tweetText = tweetContent.textContent.trim();
                const words = tweetText.split(/\s+/);
                
                words.forEach(word => {
                    if (word.length >= 32 && word.length <= 44 && isSolanaAddress(word.trim())) {
                        const solScanSpan = createSolScanElement(word.trim());
                        const span = createSpanWithAddress(tweetText, word.trim(), solScanSpan, tweetContent);
                        
                        tweetContent.parentNode.replaceChild(span, tweetContent);
                    }
                });
            }
        });
    };
    
    const createSolScanElement = (address) => {
        const solScanSpan = document.createElement('span');
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL("./assets/img/solscan-icon.png");
        img.style.width = '15px';
        img.style.height = '15px';
        img.style.marginTop = '6px';
        
        solScanSpan.style.marginLeft = '5px';
        solScanSpan.style.cursor = 'pointer';
        solScanSpan.appendChild(img);
        
        solScanSpan.addEventListener('click', () => {
            window.open(`https://solscan.io/account/${address}`, '_blank');
        });
        
        return solScanSpan;
    };
    
    const createSpanWithAddress = (tweetText, address, solScanSpan, tweetContent) => {
        const span = document.createElement('span');
        const addressIndex = tweetText.indexOf(address);
        const textBeforeAddress = tweetText.substring(0, addressIndex);
        const textAfterAddress = tweetText.substring(addressIndex + address.length);
        
        const spanBefore = document.createElement('span');
        spanBefore.textContent = textBeforeAddress;
        
        const spanAddress = document.createElement('span');
        spanAddress.textContent = address;
        
        span.appendChild(spanBefore);
        span.appendChild(spanAddress);
        span.appendChild(solScanSpan);
        
        const spanAfter = document.createElement('span');
        spanAfter.textContent = textAfterAddress;
        span.appendChild(spanAfter);
        
        span.className = tweetContent.className;
        span.style.cssText = tweetContent.style.cssText;
        
        return span;
    };
    
    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                processTweets();
            }
        });
    });
    
    observer.observe(document.body, { subtree: true, childList: true });
    
    processTweets();
};

export default findSolanaAddresses;
