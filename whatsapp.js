
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".minecardbutton").forEach(button => {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const message = "Hello Megamine Solutions Africa Limited, I would like to make an enquiry.";

            const whatsappURL =
                `https://wa.me/233243132985?text=${encodeURIComponent(message)}`;

            window.open(whatsappURL, "_blank");

        });

    });

});
