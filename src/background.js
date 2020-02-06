'use strict';

document.querySelectorAll('input[type="text"]').forEach(function(input){
	var controller = new AbortController();
	var canPaste = true;
	function closeSearchDiv(){
		var searchDiv = document.getElementById('reverseSearchFromClipboard');
		if (!searchDiv) return;
		searchDiv.style.display = 'none';
		controller.abort();
		controller = new AbortController();
	}
	function disableButton(){
		var searchButton = document.getElementById('reverseSearchFromClipboardBtn');
		if (!searchButton) return;
		searchButton.disabled = true;
		searchButton.style.cursor = 'not-allowed';
		searchButton.style.opacity = '0.7';
	}
	function enableButton(){
		var searchButton = document.getElementById('reverseSearchFromClipboardBtn');
		if (!searchButton) return;
		searchButton.disabled = false;
		searchButton.style.cursor = 'pointer';
		searchButton.style.opacity = '1';
	}
	function applyImgContainerStyle(div){
		div.style.width = '100px';
		div.style.height = '100px';
		div.style.display = 'block';
		div.style.margin = '10px auto';
		div.style.marginTop = '31px';
		div.style.position = 'relative';
	}
	function applyImgStyle(img){
		img.style.position = 'absolute';
		img.style.maxHeight = '100px';
		img.style.maxWidth = '100px';
		img.style.display = 'block';
		img.style.margin = 'auto';
		img.style.top = '0';
		img.style.bottom = '0';
		img.style.left = '0';
		img.style.right = '0';
	}
	function applySearchDivStyle(div){
		/**
		 * Styles the div that contains all the elements for the search div
		 */
		div.style.background = '#fff';
		div.style.border = '1px solid #ccc';
		div.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
		div.style.boxSizing = 'border-box';
		div.style.fontSize = '20px';
		div.style.textAlign = 'center';
		div.style.width = '100%';
		div.style.height = '200px';
		div.style.zIndex = 997;
		div.style.position = 'relative';
	}
	function applySearchDivCloseStyle(div){
		/**
		 * Styles the top-right X button that closes the search div
		 */
		div.style.background = 'url(data:image/gif;base64,R0lGODlhFQAVAPAAAAAAAAAAACH5BAEAAAEALAAAAAAVABUAAAIsjI+py+0PH2Czgatupfho+AUhqHWROJ7laZSm1KXchtLZ2+KJ7bH+DwwKFQUAOw==) no-repeat';
		div.style.cursor = 'pointer';
		div.style.display = 'inline-block';
		div.style.height = '16px';
		div.style.marginBottom = '-2px';
		div.style.position = 'absolute';
		div.style.right = '15px';
		div.style.top = '10px';
		div.style.width = '16px';
		div.style.zIndex = '312';
	}
	function applySearchButtonStyle(button){
		button.style.borderRadius = '2px';
		button.style.fontWeight = 'bold';
		button.style.height = '27px';
		button.style.lineHeight = '27px'
		button.style.padding = '0 8px';
		button.style.textAlign = 'center';
		button.style.margin = 'auto';
		button.style.width = '13em';
		button.style.backgroundColor = '#4d90fe';
		button.style.border = '1px solid #3079ed';
		button.style.color = '#fff';
	}
	function createSearchDiv(){
		if (document.getElementById('reverseSearchFromClipboard')){
			return;
		}
		var searchDiv = document.createElement('div');
		applySearchDivStyle(searchDiv);
		searchDiv.tabIndex = 0;
		searchDiv.id = 'reverseSearchFromClipboard';
		searchDiv.onkeydown = function(e){
			if (e.key === 'Escape'){
				closeSearchDiv();
			} else if (e.key === 'Enter'){
				document.getElementById('reverseSearchFromClipboardBtn').click();
			}
		};
		searchDiv.onblur = function(e){
			if (!e.currentTarget.contains(e.relatedTarget)){
				closeSearchDiv();
			}
		};

		var searchDivClose = document.createElement('div');
		applySearchDivCloseStyle(searchDivClose);
		searchDivClose.onclick = closeSearchDiv;

		var searchContainer = document.createElement('div');
		searchContainer.style.display = 'flex';
		searchContainer.style.flexDirection = 'column';

		var searchImageContainer = document.createElement('div');
		applyImgContainerStyle(searchImageContainer);

		var loadingSpinner = document.createElement('img');
		loadingSpinner.id = 'reverseSearchFromClipboardImgLoading';
		loadingSpinner.src = '/images/spin-24.gif';
		applyImgStyle(loadingSpinner);

		var searchImage = document.createElement('img');
		searchImage.id = 'reverseSearchFromClipboardImg';
		applyImgStyle(searchImage);

		var searchButton = document.createElement('button');
		searchButton.id = 'reverseSearchFromClipboardBtn';
		searchButton.innerText = 'Search by image';
		applySearchButtonStyle(searchButton);

		searchImageContainer.append(loadingSpinner);
		searchImageContainer.append(searchImage);
		searchContainer.append(searchImageContainer);
		searchContainer.append(searchButton);
		searchDiv.append(searchDivClose);
		searchDiv.append(searchContainer);

		return searchDiv;
	}
	input.onpaste = function(clipboardEvent){
		if (!canPaste) return;
		var data = clipboardEvent.clipboardData;
		if (data.files[0] && data.files[0].type === 'image/png'){
			canPaste = false;
			var fileReader = new FileReader();
			fileReader.onload = function(){
				var url = window.location.origin+'/searchbyimage/upload';
				var headers = {
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					'content-type':'multipart/form-data; boundary=--BOUNDS'
				};

				var searchDiv = createSearchDiv();

				if (searchDiv){
					input.parentElement.append(searchDiv);
					searchDiv.focus();
					disableButton();
				} else {
					searchDiv = document.getElementById('reverseSearchFromClipboard');
					searchDiv.style.display = 'inline';
					document.getElementById('reverseSearchFromClipboardImgLoading').style.display = 'block';
					document.getElementById('reverseSearchFromClipboardImg').style.display = 'none';
					searchDiv.focus();
					disableButton();
				}

				canPaste = true;

				var base64Image = fileReader.result;
				var image_content = base64Image.replace(/^data:.*;base64,/, '');
				image_content = image_content.replace(/\+/g, '-');
				image_content = image_content.replace(/\//g, '_');

				var body = '----BOUNDS\r\nContent-Disposition: form-data; name="image_content"\r\n\r\n' +
				image_content +
				'\r\n----BOUNDS--\r\n';
				fetch(url, {
					headers,
					body,
					signal: controller.signal,
					method: 'POST',
					mode: 'cors'
				}).then(function(response){
					var searchImg = document.getElementById('reverseSearchFromClipboardImg');
					document.getElementById('reverseSearchFromClipboardImgLoading').style.display = 'none';
					searchImg.src = base64Image;
					searchImg.style.display = 'block';

					var searchButton = document.getElementById('reverseSearchFromClipboardBtn');
					enableButton();
					searchButton.onclick = function(e){
						e.preventDefault();
						window.location.href = response.url;
					};
				}).catch(e => console.log(e))
			};
			fileReader.readAsDataURL(data.files[0]);
		}
	};
});
