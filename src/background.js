'use strict';

document.querySelectorAll('input[type="text"]').forEach(function(input){
	var controller = new AbortController();
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
	function createSearchDiv(){
		if (document.getElementById('reverseSearchFromClipboard')){
			return;
		}
		var searchDiv = document.createElement('div');
		searchDiv.style.background = '#fff';
		searchDiv.style.border = '1px solid #ccc';
		searchDiv.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
		searchDiv.style.boxSizing = 'border-box';
		searchDiv.style.fontSize = '20px';
		searchDiv.style.textAlign = 'center';
		searchDiv.style.width = '100%';
		searchDiv.style.height = '200px';
		searchDiv.style.zIndex = 997;
		searchDiv.style.position = 'relative';
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
		searchDivClose.style.background = 'url(data:image/gif;base64,R0lGODlhFQAVAPAAAAAAAAAAACH5BAEAAAEALAAAAAAVABUAAAIsjI+py+0PH2Czgatupfho+AUhqHWROJ7laZSm1KXchtLZ2+KJ7bH+DwwKFQUAOw==) no-repeat';
		searchDivClose.style.cursor = 'pointer';
		searchDivClose.style.display = 'inline-block';
		searchDivClose.style.height = '16px';
		searchDivClose.style.marginBottom = '-2px';
		searchDivClose.style.position = 'absolute';
		searchDivClose.style.right = '15px';
		searchDivClose.style.top = '10px';
		searchDivClose.style.width = '16px';
		searchDivClose.style.zIndex = '312';
		searchDivClose.onclick = closeSearchDiv;

		var searchContainer = document.createElement('div');
		searchContainer.style.display = 'flex';
		searchContainer.style.flexDirection = 'column';

		var searchImageContainer = document.createElement('div');
		searchImageContainer.style.width = '100px';
		searchImageContainer.style.height = '100px';
		searchImageContainer.style.display = 'block';
		searchImageContainer.style.margin = '10px auto';
		searchImageContainer.style.marginTop = '31px';
		searchImageContainer.style.position = 'relative';

		var loadingSpinner = document.createElement('img');
		loadingSpinner.id = 'reverseSearchFromClipboardImgLoading';
		loadingSpinner.src = '/images/spin-24.gif';
		loadingSpinner.style.position = 'absolute';
		loadingSpinner.style.maxHeight = '100px';
		loadingSpinner.style.maxWidth = '100px';
		loadingSpinner.style.display = 'block';
		loadingSpinner.style.margin = 'auto';
		loadingSpinner.style.top = '0';
		loadingSpinner.style.bottom = '0';
		loadingSpinner.style.left = '0';
		loadingSpinner.style.right = '0';

		var searchImage = document.createElement('img');
		searchImage.id = 'reverseSearchFromClipboardImg';
		searchImage.style.maxHeight = '100px';
		searchImage.style.maxWidth = '100px';
		searchImage.style.height = 'auto';
		searchImage.style.width = '100%';
		searchImage.style.display = 'block';

		var searchButton = document.createElement('button');
		searchButton.id = 'reverseSearchFromClipboardBtn';
		searchButton.innerText = 'Search by image';
		searchButton.style.borderRadius = '2px';
		searchButton.style.fontWeight = 'bold';
		searchButton.style.height = '27px';
		searchButton.style.lineHeight = '27px'
		searchButton.style.padding = '0 8px';
		searchButton.style.textAlign = 'center';
		searchButton.style.margin = 'auto';
		searchButton.style.width = '13em';
		searchButton.style.backgroundColor = '#4d90fe';
		searchButton.style.border = '1px solid #3079ed';
		searchButton.style.color = '#fff';

		searchImageContainer.append(loadingSpinner);
		searchImageContainer.append(searchImage);
		searchContainer.append(searchImageContainer);
		searchContainer.append(searchButton);
		searchDiv.append(searchDivClose);
		searchDiv.append(searchContainer);

		return searchDiv;
	}
	input.onpaste = function(clipboardEvent){
		var data = clipboardEvent.clipboardData;
		if (data.files[0] && data.files[0].type === 'image/png'){
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
					searchImg.style.height = 'auto';

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
