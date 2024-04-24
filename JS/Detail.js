$(document).ready(function () {
    function downloadImage(imageUrl) {
        // Fonction pour télécharger une image
        var link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Gestionnaire d'événements pour le clic sur .movie-link
    $('.movie-link').on('click', function () {
        var filmId = $(this).data('film-id');
        var filmName = $(this).data('film-name');

        console.log('Film ID:', filmId);
        console.log('Film Name:', filmName);

        var imageUrl = $(this).find('img').attr('src');

        var $clone = $(this).find('img').clone().addClass('enlarged-image');
        var $background = $('<div class="blurred-background"></div>');

        $('body').append($clone, $background);

        var $cross = $('<img src="../Images/cross.webp" alt="cross">').css({
            'position': 'fixed',
            'top': '5%',
            'right': '3%',
            'transform': 'translate(-50%, -50%)',
            'width': '45px',
            'height': 'auto',
            'z-index': '9999',
            'cursor': 'pointer'
        });

        var $like = $('<img src="../Images/Like.png" alt="Like">').css({
            'position': 'fixed',
            'top': '72%',
            'right': '30%',
            'width': '70px',
            'height': 'auto',
            'z-index': '9999',
            'cursor': 'pointer'
        });

        var $dislike = $('<img src="../Images/Dislike.png" alt="Dislike">').css({
            'position': 'fixed',
            'top': '80%',
            'right': '30%',
            'width': '70px',
            'height': 'auto',
            'z-index': '9999',
            'cursor': 'pointer'
        });

        var $downloadLink = $('<img src="../Images/Download.png" alt="Download">').css({
            'position': 'fixed',
            'top': '88%',
            'right': '30%',
            'width': '70px',
            'height': 'auto',
            'z-index': '9999',
            'cursor': 'pointer'
        });

        // Gestionnaire d'événements pour le clic sur l'icône de croix
        $cross.on('click', function () {
            $clone.remove();
            $background.remove();
            $(this).remove();
            $downloadLink.remove();
            $like.remove();
            $dislike.remove();
        });

        $('body').append($cross);
        $('body').append($like);
        $('body').append($dislike);
        $('body').append($downloadLink);


        $clone.on('click', function () {
            $clone.remove();
            $background.remove();
            $cross.remove();
            $downloadLink.remove();
            $like.remove();
            $dislike.remove();
        });

        $downloadLink.on('click', function () {
            downloadImage(imageUrl);
        });

        
        $('.movie-link').on('click', function () {
            var filmId = $(this).data('film-id');
            var filmName = $(this).data('film-name');
    
            // Autre code pour l'affichage des éléments
    
            // Récupérer l'état du like/dislike depuis localStorage
            var likeState = localStorage.getItem(`film_${filmId}_like`);
            if (likeState === 'like') {
                $like.attr('src', '../Images/LikeB.png'); // Mettre à jour l'image de like
            } else if (likeState === 'dislike') {
                $dislike.attr('src', '../Images/DislikeB.png'); // Mettre à jour l'image de dislike
            }
    
            // Autre code pour les gestionnaires d'événements
        });


        // Gestionnaire d'événements pour le clic sur l'icône de like
        $like.on('click', function () {
            var $likeImg = $(this);
            var isLiked = $likeImg.attr('src') === '../Images/LikeB.png';
        
            if (isLiked) {
                $likeImg.attr('src', '../Images/Like.png');
                removeLike(filmId);
                localStorage.removeItem(`film_${filmId}_like`);
            } else {
                $likeImg.attr('src', '../Images/LikeB.png');
                addLike(filmId, filmName, $likeImg);
                localStorage.setItem(`film_${filmId}_like`, 'like');
            }
        });

        // Gestionnaire d'événements pour le clic sur l'icône de dislike
        $dislike.on('click', function () {
            var $dislikeImg = $(this);
            var isDisliked = $dislikeImg.attr('src') === '../Images/DislikeB.png';
        
            if (isDisliked) {
                $dislikeImg.attr('src', '../Images/Dislike.png');
                removeDislike(filmId);
                localStorage.removeItem(`film_${filmId}_like`);
            } else {
                $dislikeImg.attr('src', '../Images/DislikeB.png');
                addDislike(filmId, filmName);
                localStorage.setItem(`film_${filmId}_like`, 'dislike');
            }
        });

        // Gestionnaire d'événements pour le clic sur l'image clonée
        

        // Gestionnaire d'événements pour le clic sur l'icône de téléchargement

        // Fonction pour ajouter un like
        function addLike(filmId, filmName, $likeImg) {
    $.ajax({
        method: 'POST',
        url: '../Controler/update-like.php',
        data: {
            filmId: filmId,
            action: 'like',
            filmName: filmName
        },
        success: function (response) {
            console.log('Like ajouté avec succès pour le film : ' + filmName);
            $likeImg.addClass('liked');
            localStorage.setItem(`film_${filmId}_like`, 'like'); // Mettre à jour localStorage
        },
        error: function (xhr, status, error) {
            console.error('Erreur lors de l\'ajout du like :', error);
        }
    });
}

function removeLike(filmId) {
    $.ajax({
        method: 'POST',
        url: '../Controler/remove-like.php',
        data: {
            filmId: filmId,
            action: 'remove-like'
        },
        success: function (response) {
            console.log('Like retiré avec succès pour le film ID : ' + filmId);
            localStorage.removeItem(`film_${filmId}_like`); // Supprimer l'entrée dans localStorage
            // Mettre à jour l'interface utilisateur si nécessaire
        },
        error: function (xhr, status, error) {
            console.error('Erreur lors du retrait du like :', error);
        }
    });
}

function removeDislike(filmId) {
    $.ajax({
        method: 'POST',
        url: '../Controler/remove-dislike.php',
        data: {
            filmId: filmId,
            action: 'remove-dislike'
        },
        success: function (response) {
            console.log('Dislike retiré avec succès pour le film ID : ' + filmId);
            localStorage.removeItem(`film_${filmId}_like`); // Supprimer l'entrée dans localStorage
            // Mettre à jour l'interface utilisateur si nécessaire
        },
        error: function (xhr, status, error) {
            console.error('Erreur lors du retrait du dislike :', error);
        }
    });
}

function addDislike(filmId, filmName) {
    $.ajax({
        method: 'POST',
        url: '../Controler/update-dislike.php',
        data: {
            filmId: filmId,
            action: 'add-dislike',
            filmName: filmName
        },
        success: function (response) {
            console.log('Dislike ajouté avec succès pour le film : ' + filmName);
            localStorage.setItem(`film_${filmId}_like`, 'dislike'); // Mettre à jour localStorage
            // Mettre à jour l'interface utilisateur si nécessaire
        },
        error: function (xhr, status, error) {
            console.error('Erreur lors de l\'ajout du dislike :', error);
        }
    });
}

    });
});
