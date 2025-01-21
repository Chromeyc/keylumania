document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');
    
    if (hash) {
        fetch(`/api/verify-linkvertise?hash=${hash}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.key) {
                    document.getElementById('keyDisplay').classList.remove('hidden');
                    document.getElementById('getKeySection').classList.add('hidden');
                    document.getElementById('keyText').textContent = data.key;
                }
            })
            .catch(err => {
                alert('Error getting key. Please try again.');
            });
    }
}); 