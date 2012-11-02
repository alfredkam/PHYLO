
<script type="text/javascript">
	//scripts to update tags
	(function() {
		//updates tag,
		$("a").each(function(){
			if($(this).attr("href") == "#customize") 
			{
				$(this).attr("href","javascript:void(0);");
				$(this).attr("id","customize");
			}
		});
	})();
</script>

<div class='wrapper'>
			<div class='customize customize-bg'></div>
			<div class='customize customize-wrapper'>
				<div class='row customize-title'>
					Customize
				</div>
				<div class='customize-tab'>
					<div class='row'>
						<a href='javascript:void(0)' class='customize-tab-onselect span2 tag-theme'>Theme</a>
						<a href='javascript:void(0)' class='span2 tag-music'>Music</a>
					</div>
				</div>
				<div class='customize-body'>
					<div class='row'>
						<div class='customize-theme'>
							<div class='span4' >
								<div class='customize-boardColor'>
									<div class='row customize-title'>
											Board Color:
									</div>
									<div class='row'>
										<div class='colorCell customize-theme-cell customize-theme-onpick colorBG'>
										</div>
									</div>
								</div>
								<div class='customize-dnaColor'>
									<div class='customize-title row'>
										DNA Color:
									</div>
									<div class='row'>
										<div class='colorCell customize-theme-cell colorA'>
										</div>
										<div class='colorCell customize-theme-cell colorG '>
										</div>
										<div class='colorCell customize-theme-cell colorC'>
										</div>
										<div class='colorCell customize-theme-cell colorT'>
										</div>
									</div>
								</div>
								<div class='row'>
									<br><br>
									<a href='javascript:void(0);' class='customize-theme-reset btn-danger btn'>
										Restore Default	
									</a>	
								</div>
							</div>
							<div class='span5'>
								<canvas id='colorpad' width='256' height='256'>

								</canvas>
							</div>
						</div>
						<div class='customize-music'>
							<div class='row customize-title'>
								Current Music Theme	
							</div>
							<div class='row'>

							</div>
						</div>	
					</div>
				</div>
				<div class='customize-buttons'>
					<div class='row'>
						<a href='javascript:void(0)' class='customize-save btn btn-primary offset4 span2'>
							Save
						</a>
						<a href='javascript:void(0)' class='customize-cancel btn btn-primary span2'>
							Cancel
						</a>
					</div>
				</div>
			</div>
		</div>