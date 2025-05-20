//jqClick
$(document).ready(function () {
	$('button.destroy').click(function (e) {
		e.preventDefault();
		const data_href = $(this).attr('data-href');
		$('#confirm-delete').data('href', data_href);
		$('#exampleModal').modal('show');
	});

	$('#confirm-delete').click(function () {
		const data_href = $(this).data('href');
		window.location.href = data_href;
	});
});

const gotoPage = (page) => {
	const currentURL = window.location.href;
	const obj = new URL(currentURL);
	obj.searchParams.set('page', page);

	window.location.href = obj.href;
}

$(".form-student-create, .form-student-edit").validate({
	rules: {
		name: {
			required: true,
			maxlength: 50,
			regex: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/i
		},
		birthday: {
			required: true,
		},
		gender: {
			required: true,
		}
	},
	messages: {
		name: {
			required: 'Pls enter name',
			maxlength: 'Pls do not enter overseed 50 words',
			regex: 'Pls do not enter special words'
		},
		birthday: {
			required: 'Vui lòng chọn ngày sinh.',
		},
		gender: {
			required: 'Vui lòng chọn giới tính.'
		}
	}
});

$(".form-subject-create, .form-subject-edit").validate({
	rules: {
		name: {
			required: true,
			maxlength: 50,
		},
		number_of_credit: {
			required: true,
			digits: true,
			range: [1, 4],
		},
	},
	messages: {
		name: {
			required: 'Pls enter name',
			maxlength: 'Pls do not enter overseed 50 words',
			regex: 'Pls do not enter special words'
		},
		number_of_credit: {
			required: 'Vui lòng nhập số tín chỉ.',
			digits: 'Dzui lòng nhập số  nguyên',
			range: 'Số tín chỉ nhỏ hơn 5'
		},
	}
});

$(".form-register-create").validate({
	rules: {
		student_id: {
			required: true,
		},
		subject_id: {
			required: true,
		},
	},
	messages: {
		student_id: {
			required: 'Vui lòng chọn sinh viên.',
		},
		subject_id: {
			required: 'Vui lòng chọn môn học.',
		},
	}
});

$(".form-register-edit").validate({
	rules: {
		score: {
			required: true,
			range: [0, 10],
		},
		subject_id: {
			required: true,
			range: 'Vui lòng nhập điểm từ 1 đến 10.'
		},
	},
	messages: {
		score: {
			required: 'Vui lòng nhập điểm thi.',
		},
	}
});

